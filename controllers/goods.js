const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

//{goods
const handleGoodsGet = (req, res) =>{
    console.log('!!! inn header:' + req.headers.inn);
    client
        .query('select goods.code as code,\n' +
            'folders.folder_name as folder,\n' +
            'goods.description as description,\n' +
            'goods.measure as measure,\n' +
            'goods.sort as sort, \n' +
            'coalesce (goods.rate, 1) as rate, \n' +
            'coalesce(spec.price, prices.price) as price,\n' +
            'prices.spec as spec,\n' +
            'stock.stock as quantity\n' +
            'from goods as goods\n' +
            'left join   folders as folders\n' +
            'on goods.folder = folders.code\n' +
            'left join prices as prices\n' +
            'on goods.code = prices.good\n' +
            'left join stock as stock\n' +
            'on goods.code = stock.good\n' +
            'left join\n' +
            '   (SELECT sp.good, sp.price\n' +
            '   FROM spec_prices as sp\n' +
            '   inner join users \n' +
            '   on sp.sort = users.spec_price\n' +
            `   where users.inn = ${(req.headers.inn) ? req.headers.inn : 0}) as spec\n` +
            '   on goods.code = spec.good\t\n' +
            getFullFiltertext(req) +
            'order by goods.sort::bytea'
        )
        .then(goods => res.json(goods.rows))
        .catch(e => console.error(e.stack))
};

const getFullFiltertext = (req)=>{
    if (!req.params.folder) return '';
     return ` where goods.folder = '${req.params.folder}' \n`
        + parseAttributeFilter(req.query.attributes_filter);
};

const parseAttributeFilter = (filterString) => {

    try {
        const fullFilterArray = JSON.parse(filterString);
        const filterArray = fullFilterArray.filter(elem => elem.values.length);
        if(!filterArray.length) return '';

        let subQuery =" and goods.code in (select distinct attr0.good from \n" +
            filterArray.reduce((accum,elem,i,arr) => {
            accum += `(select attr.good as good
                    FROM public.goods_attributes as attr
                    where (attr."attribute" = ${elem.attribute} and attr.value in ${JSON.stringify(elem.values)
                    .replace('[','(')
                    .replace(/"/g,"'")
                    .replace(']',')')})) as attr${i}`
                + ((i>0) ? ` on attr0.good = attr${i}.good` : '')
                + ((i===arr.length-1) ? ' )':'\n inner join \n');
            return accum;
        }, '');

        console.log(subQuery);
        return subQuery;

    } catch (e) {
        console.log(e.stack);
        return '';
    }
};

const handleGoodsPost = (req, res) => {

    Promise.resolve(req.body)
        // .then(goodsJSON => {
        //     console.log(typeof(goodsJSON));
        //     return JSON.parse(goodsJSON
        //     )})
        .then(goodsData => updateGoodsData(goodsData, true))
        .then(gpData => res.json(gpData))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update goods now');
        });
};

const updateGoodsData = async (goods, clearTables=false) =>{

    if (clearTables){
        await clearGoodsTables();
    }

    const insertedValues = goods.reduce((accum,elem,i,arr) => {
        const {code, folder, description, measure, price, spec, quantity, sort} = elem;
        const lastElem = (i === arr.length - 1);
        let rate = elem.rate || 1;

        //TODO:
        // Separate to diff procedures DRY bitch!

        accum.goods     += `('${code}', '${folder}', '${description}', '${measure}','${sort}', ${rate})` + (lastElem ? ' ':', ');
        accum.prices    += `('${code}', ${price}, now(), ${spec})` + (lastElem ? ' ':', ');
        accum.stock     += `('${code}', ${quantity}, 0, now())` + (lastElem ? ' ':', ');
        accum.attributes+= getAttributesInsertString(elem.code, elem.attributes);
        return accum;
    }, {goods:' ', prices: '',stock: '', attributes:''});

    await updateGoods(insertedValues.goods);
    await Promise.all([
        updateStock(insertedValues.stock),
        updatePrices(insertedValues.prices),
        updateGoodAttributes(insertedValues.attributes.slice(0,insertedValues.attributes.length-1))
    ]);

    return 'goods update successfully, smile-smile';
};

const updateGoods = (goods) =>{
    //console.log(goods);

    return client.query('INSERT INTO goods (code, folder, description, measure, sort, rate) VALUES ' + goods +
        '\n on conflict (code) do update set folder=excluded.folder, description=excluded.description, measure=excluded.measure, ' +
        'sort=excluded.sort, rate=excluded.rate;')
        .then(console.log('goods - Ok'));

};

const clearGoodsTables =  () => {
    return client.query('');
};
//goods}

//{attributes & filters
const handleAttributesGet = (req, res) => {
    client
        .query(
            `SELECT attribute_name as attr, GA.value as value
                    FROM public.goods_attributes AS GA 
                    INNER JOIN public."attributes" ON "attribute" = code
                    WHERE good = '${req.params.good}'`
        )
        .then(goods => res.json(goods.rows))
        .catch(e => console.error(e.stack))
};

const handleGoodAttributesPost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem) => {
        accum += getAttributesInsertString(elem.code, elem.attributes);
        return accum;
        },''))
        .then((attributesString) => updateAttributes(attributesString))
        .then(res.json('Goods attributes was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update attributes now');
        });

};

const handleAttributesPost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem,i,arr) => {
        accum += `('${elem.code}', '${elem.name}', 'empty')` + ((i===arr.length-1) ? ' ':', ');
        return accum;
        },''))
        .then((attributesString) => updateAttributes(attributesString))
        .then(res.json('Attributes was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update attributes now');
        });

};

const updateGoodAttributes = (attributes) => {
    if (!attributes) return Promise.resolve(true);
    return client.query('INSERT INTO public.goods_attributes (good,"attribute",value) VALUES ' + attributes +
        '\n on conflict (good, attribute) do update set value=excluded.value')
        .then(console.log('attributes - Ok'));
};

const updateAttributes = (attributes) => {
    return client.query('INSERT INTO public."attributes" (code,attribute_name,measure)\n VALUES' + attributes +
        '\n on conflict (code) do update set code=excluded.code, attribute_name=excluded.attribute_name, measure=excluded.measure;');
};

const getAttributesInsertString = (good, atrArray) => {
    return atrArray.reduce((accum,elem,i,arr) => {
        accum += `(${good}, '${elem[0]}', '${elem[1]}'),`; //+ ((i===arr.length-1) ?' ':', ');
        return accum;
    }, '');
};

const handleFiltersGet = (req, res) => {

    client
        .query(
            `select attr.code as filter_code, attr.attribute_name as filter_name, goods_attr.val as value
                        from public."attributes" as attr
                        inner join
                            (SELECT distinct "attribute" as good_attr, value as val
                            FROM public.goods_attributes as attr
                            inner join public.goods as goods
                            on attr.good = goods.code
                            where goods.folder = '${req.params.folder}') as goods_attr
                        on attr.code = goods_attr.good_attr
                        order by filter_code`
        )
        .then(filters => {
            const filterObject =  filters.rows.reduce((accum,elem,i,arr)=>{
                if(i===0 || elem.filter_code !== arr[i-1].filter_code){
                    accum.push({
                        filter_code: elem.filter_code,
                        filter_name: elem.filter_name,
                        filter_values: [elem.value]
                    });
                } else {
                    accum[accum.length-1].filter_values.push(elem.value);
                }
                return accum;
            },[]);
            res.json(filterObject);
        })
        .catch(e => console.error(e.stack))


};
//attributes & filters}

//{prices & stock
const handlePricePost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem,i,arr) => {
        accum += `('${elem.good}', ${elem.price}, now(), ${elem.spec})` + ((i===arr.length-1) ? ' ':', ');
        return accum;
    },''))
        .then((prices) => updatePrices(prices))
        .then(res.json('prices was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update prices now');
        });

};

const handleStockPost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem,i,arr) => {
        accum += `('${elem.good}', ${elem.stock}, 0, now())` + ((i===arr.length-1) ? ' ':', ');
        return accum;
    },''))
        .then((stock) => updateStock(stock))
        .then(res.json('Stock was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update stock now');
        });

};

const updatePrices = (prices) => {
    //console.log(prices);
    return client.query('INSERT INTO prices (good, price, updated, spec) VALUES ' + prices +
    '\n on conflict (good) do update set price=excluded.price, updated=now(), spec=excluded.spec')
        .then(console.log('prices - Ok'));
};

const updateStock = (stock) => {
    //console.log(stock);
    return client.query('INSERT INTO stock (good, stock, maxorder, updated) VALUES ' + stock +
        '\n on conflict (good) do update set stock=excluded.stock, updated=now(), maxorder=excluded.maxorder')
        .then(console.log('stock - Ok'));
};

const handleSpecPricePost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem,i,arr) => {
        accum += `('${elem.good}', ${elem.price}, now(), '${elem.sort}')` + ((i===arr.length-1) ? ' ':', ');
        return accum;
    },''))
        .then((prices) => updateSpecPrices(prices))
        .then(res.json('prices was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update prices now');
        });

};

const updateSpecPrices = (prices) => {
    return client.query('INSERT INTO spec_prices (good, price, updated, sort) VALUES ' + prices +
        '\n on conflict (good, sort) do update set price=excluded.price, updated=now()');
};

//prices & stock}

//{folders
const handleFoldersGet = (req, res) => {
    client
        .query('SELECT f.code as code, f.folder_name AS folder, p.code as parent_code, p.folder_name AS parent\n' +
            'FROM folders f\n' +
            'INNER JOIN folders p ON f.parent = p.code\n' +
            'ORDER BY p.folder_name')
        .then(folders => res.json(createFoldersStructure(folders.rows)))
        .catch(e => console.error(e.stack));
};

const createFoldersStructure = (foldersRows) => {

    let currParent = {};
    let foldersStructure = [];
    foldersRows.forEach(elem => {
        if (currParent.name !== elem.parent) {
            currParent = createFolderObject(elem.parent, elem.parent_code);
            foldersStructure.push(currParent);
        }
        currParent.children.push(createFolderObject(elem.folder, elem.code));
    });

    return foldersStructure;
};

const createFolderObject = (folderName, folderCode) => {
    return {
        code: folderCode,
        name: folderName,
        children: []
    }
};

const handleFoldersPost = (req, res) => {

    Promise.resolve(req.body)
        .then(foldersObject => updateFolders(foldersObject))
        .then(query => res.json('folders structure updated successfully: ' + query))
        .catch(e => {
            console.error(e.stack);
            res.status(500).json(e);
        });

};

const updateFolders = (foldersObject) => {

    const updateStrings = foldersObject.reduce((accum, parent)=>{
        accum.parents += `('${parent.code}', '${parent.name}','0'),`;
        accum.children += parent.children.reduce((childrenValues, cjhild)=>{
            childrenValues += `('${cjhild.code}', '${cjhild.name}','${parent.code}'),`;
            return childrenValues;
        },'');
        return accum;
    }, {parents:'', children:''});

    updateStrings.children = updateStrings.children.slice(0,-1);

    return client
            .query('INSERT INTO public.folders (code,folder_name,parent) VALUES ' +
                updateStrings.parents + updateStrings.children +
                ' on conflict (code) do update set folder_name=excluded.folder_name, parent=excluded.parent');
};
//folders}

module.exports = {handleFoldersGet, handleFoldersPost, handleGoodsGet, handleGoodsPost, handleAttributesPost,
    handleAttributesGet, handleGoodAttributesPost, handlePricePost, handleStockPost, handleFiltersGet,
    handleSpecPricePost};