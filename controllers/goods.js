const {Client} = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString,
});
client.connect();

const handleGoodsGet = (req, res, pg) =>{
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
        .then(goods => updateGoods(goods))
        .then(gpData => res.json(gpData))
        .catch(e => {
            console.log(e.stack);
            res.status(500).json('can not update goods now');
        });
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

module.exports = {handleGoodsGet, handleFoldersGet, handleFiltersGet, handleGoodsPost};