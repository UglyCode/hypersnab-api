const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

const handleGoodsGet = (req, res) =>{
    client
        .query('SELECT * FROM public.goods\n' +
            'ORDER BY code')
        .then(goods => res.json(goods.rows))
        .catch(e => console.error(e.stack))

};

const handleFiltersGet = (req, res, pg) => {
    // const {inn} = req.params;
    // const {name, kpp, contact, address, phone, email} = req.body.formInput;
    // pg('users')
    //     .where({inn})
    //     .update({name, inn, kpp, contact, address, phone, email})
    //     .then(response =>{
    //         if (response) {
    //             res.json('all done')
    //         } else{
    //             res.status(400).json('smth went wrong')
    //         }
    //     })
    //     .catch(err => res.status(500).json('error appeared while updating'))
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

    const nandlers = [new Promise(updateGoods()), apdateStock, updatePrices];

    Promise.resolve(req.bosy)
        .then(goodsJSON => parseGoodsJSON(goodsJSON))
        .then(goodsData =>{
            goodsUpdatePromise = new Promise(updateGoods(goodsData.goods));
            stockUpdatePromise = new Promise(updateStock(goodsData.stock));
            pricesUpdatePromise = new Promise(updatePrices(goodsData.prices));
            return Promise.all([goodsUpdatePromise, stockUpdatePromise, pricesUpdatePromise]);
        })
        .then(gpData => res.json(gpData))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update goods now');
        });
};

const parseGoodsJSON = (goods) =>{

    return goods.reduce((elem, acc) => {
        acc.goods.push(elem);
        acc.stock.push(elem);
        acc.prices.push(elem);
        return acc;
    },
        {
            goods: {},
            stock: {},
            prices: {}
        })
};

const updateGoods = (goods) =>{

    const insertedValues = goods.reduce((accum,elem,i,arr) => {
        const {code, folder, description, measure} = elem;
        return(accum + `(${code}, '${folder}', '${description}','${measure}',true,CURRENT_TIMESTAMP)` + ((i===arr.length-1) ?' ':', '));
    }, '');

    return (client
            .query('insert into goods (code,folder,description,measure,available,image) \n' +
                `  values ${insertedValues} \n` +
                '  ON CONFLICT (code) DO UPDATE SET \n' +
                '  folder=EXCLUDED.folder,description=EXCLUDED.description,measure=EXCLUDED.measure,\n' +
                '  available=EXCLUDED.available,image=EXCLUDED.image,updated=CURRENT_TIMESTAMP'));
};

const updateStock = (stock) => {
    return stock;
};

const updateprices = (prices) => {
    return prices;
}

module.exports = {handleGoodsGet, handleFoldersGet, handleFiltersGet, handleGoodsPost, handleFullGoodsUpdate};