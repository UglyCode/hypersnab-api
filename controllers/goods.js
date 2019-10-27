const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

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
            '\ton goods.code = stock.good')
        .then(goods => res.json(goods.rows))
        .catch(e => console.error(e.stack))
};

const handleFiltersGet = (req, res, pg) => {

};

const handleFoldersGet = (req, res) => {
    client
        .query('SELECT f.name AS folder, p.name AS parent\n' +
            'FROM folders f\n' +
            'INNER JOIN folders p ON f.parent = p.code\n' +
            'ORDER BY p.name')
        .then(folders => res.json(createFoldersStructure(folders.rows)))
        .catch(e => console.error(e.stack))
};

const handleFullGoodsUpdate = (req, res) => {

};

const createFoldersStructure = (foldersRows) => {

    let currParent = {};
    let foldersStructure = [];
    foldersRows.forEach(elem => {
        if (currParent.name !== elem.parent) {
            currParent = createFolderObject(elem.parent);
            foldersStructure.push(currParent);
        }
        currParent.children.push(createFolderObject(elem.folder));
    });

    return foldersStructure;
};

const createFolderObject = (folderName) => {
    return {
        name: folderName,
        children: []
    }
};

const handleGoodsPost = (req, res) => {

    Promise.resolve(req.body)
        .then(goodsJSON => JSON.parse(goodsJSON))
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
        accum.goods     += `('${code}', '${folder}', '${description}', '${measure}','${sort}')` + ((i===arr.length-1) ?' ':', ');
        accum.prices    += `(${code}, '${price}', now(),'${spec}')` + ((i===arr.length-1) ?' ':', ');
        accum.stock     += `(${code}, '${quantity}', 0, now())` + ((i===arr.length-1) ?' ':', ');
        accum.attributes+= getAttributesInsertString(elem.code, elem.attributes);
        return accum;
    }, {goods:' ', prices: '',stock: '', attributes:''});

    await updateGoods(insertedValues.goods);
    await Promise.all([
        updateStock(insertedValues.prices),
        updatePrices(insertedValues.stock)
     //   updateAttributes(insertedValues.attributes)
    ]);

    return 'goods update successfully, smile-smile';
};

const clearGoodsTables =  () => {
    return client.query('');
};

const updateGoods = (goods) =>{
    return client.query('INSERT INTO goods (code, folder, description, measure, sort) VALUES ' + goods +
    '\n on conflict (code) do update set folder=excluded.folder, description=excluded.description, measure=excluded.measure, sort=excluded.sort;');
};

const updatePrices = (prices) => {
    return client.query('INSERT INTO prices (good, price, updated, spec) VALUES ' + prices +
    '\n on conflict (good) do update set price=excluded.price, updated=now(), spec=excluded.spec');
};

const updateStock = (stock) => {
    return client.query('INSERT INTO Columns (good, stock, maxorder, updated) VALUES ' + stock +
        '\n on conflict (good) do update set stock=excluded.stock, updated=now(), maxorder=excluded.maxorder');
};

const updateAttributes = (attributes) => {
    return client.query('INSERT INTO stock (good, attribute, value) VALUES ' + attributes +
        '\n on conflict (good, attribute) do update set value=excluded.value');
};

const getAttributesInsertString = (good,atrArray) => {
    return atrArray.reduce((accum,elem,i,arr) => {
        accum += `(${good}, '${elem[0]}', '${elem[1]}'` + ((i===arr.length-1) ?' ':', ');
        return accum;
    }, '');
};

module.exports = {handleGoodsGet, handleFoldersGet, handleFiltersGet, handleGoodsPost, handleFullGoodsUpdate};