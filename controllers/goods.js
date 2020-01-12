const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

//{goods
const handleGoodsGet = (req, res) =>{
    client
        .query('select goods.code as code, \n' +
            'folders.folder_name as folder, \n' +
            'goods.description as description, \n' +
            'goods.measure as measure, \n' +
            'goods.sort as sort, \n' +
            'prices.price as price,\n' +
            'prices.spec as spec,\n' +
            'stock.stock as quantity\n' +
            '\tfrom goods as goods\n' +
            'left join   folders as folders\n' +
            '\ton goods.folder = folders.code\n' +
            'left join prices as prices\n' +
            '\ton goods.code = prices.good\n' +
            'left join stock as stock\n' +
            '\ton goods.code = stock.good' +
            getFullFiltertext(req)
        )
        .then(goods => res.json(goods.rows))
        .catch(e => console.error(e.stack))
};

const getFullFiltertext = (req)=>{
    if (!req.params.folder) return '';
    return `\n where goods.folder = '${req.params.folder}'`
        + parseAttributeFilter(req.query.attribure_filter)
};

const  parseAttributeFilter = (filterString) => {

    let filterArray = [];
    try {
        filterArray = JSON.parse(filterString);
        if(!filterArray.length) return '';
        return filterArray.reduce((accum,elem,i,arr) => {
            accum += `(attr."attribute" = ${elem.attribute} and attr.value in ${JSON.stringify(elem.values)
                    .replace('[','(')
                    .replace(/"/g,"'")
                    .replace(']',')')})`
                + ((i===arr.length-1) ? ')':' OR ');
            return accum;
        }, `and goods.code in (SELECT distinct attr.good
            FROM public.goods_attributes as attr
            where `);
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

        //TODO:
        // Separate to diff procedures DRY bitch!

        accum.goods     += `('${code}', '${folder}', '${description}', '${measure}','${sort}')` + (lastElem ? ' ':', ');
        accum.prices    += `('${code}', ${price}, now(), ${spec})` + (lastElem ? ' ':', ');
        accum.stock     += `('${code}', ${quantity}, 0, now())` + (lastElem ? ' ':', ');
        accum.attributes+= getAttributesInsertString(elem.code, elem.attributes);
        return accum;
    }, {goods:' ', prices: '',stock: '', attributes:''});

    await updateGoods(insertedValues.goods);
    await Promise.all([
        updateStock(insertedValues.stock),
        updatePrices(insertedValues.prices),
        updateAttributes(insertedValues.attributes)
    ]);

    return 'goods update successfully, smile-smile';
};

const updateGoods = (goods) =>{
    return client.query('INSERT INTO goods (code, folder, description, measure, sort) VALUES ' + goods +
        '\n on conflict (code) do update set folder=excluded.folder, description=excluded.description, measure=excluded.measure, sort=excluded.sort;');
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

const handleAtttributesPost = (req, res) => {

    Promise.resolve(req.body.reduce((accum,elem) => {
        accum += getAttributesInsertString(elem.code, elem.attributes);
        return accum;
        },''))
        .then((attributesString) => updateAttributes(attributesString))
        .then(res.json('Attributes was updated successfully'))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update attributes now');
        });

};

const updateAttributes = (attributes) => {
    return client.query('INSERT INTO public.goods_attributes (good,"attribute",value) VALUES ' + attributes +
        '\n on conflict (good, attribute) do update set value=excluded.value');
};

const getAttributesInsertString = (good, atrArray) => {
    return atrArray.reduce((accum,elem,i,arr) => {
        accum += `(${good}, '${elem[0]}', '${elem[1]}'` + ((i===arr.length-1) ?' ':', ');
        return accum;
    }, '');
};

const handleFiltersGet = (req, res) => {

    client
        .query(
            `select attr.code as filter_code, attr.attribute_name as filter_name
                    from public."attributes" as attr
                    where attr.code IN 
                        \t(SELECT distinct "attribute"
                        \tFROM public.goods_attributes as attr
                        \tinner join public.goods as goods
                        \ton attr.good = goods.code
                        \twhere goods.folder = '${req.params.folder}')`
        )
        .then(filters => res.json(filters.rows))
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
    return client.query('INSERT INTO prices (good, price, updated, spec) VALUES ' + prices +
    '\n on conflict (good) do update set price=excluded.price, updated=now(), spec=excluded.spec');
};

const updateStock = (stock) => {
    return client.query('INSERT INTO stock (good, stock, maxorder, updated) VALUES ' + stock +
        '\n on conflict (good) do update set stock=excluded.stock, updated=now(), maxorder=excluded.maxorder');
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

module.exports = {handleFoldersGet, handleFoldersPost, handleGoodsGet, handleGoodsPost,
    handleAttributesGet, handleAtttributesPost, handlePricePost, handleStockPost, handleFiltersGet};