const express = require("express");
const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: '1234',
    database: 'nodedb'
}

const mysql = require('mysql')

async function createTable(){
    const sqlTable = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`;
    return query(sqlTable);
}

async function seedUsers(){
    const addUsers = `INSERT INTO people(name) VALUES ('Andrew'), ('Joao'), ('Maria');`;
    return await query(addUsers)
}

async function init (){
    return await createTable().then(() => seedUsers())
};

async function query(sql) {
    const connection = mysql.createConnection(config);
    const queryPromise = new Promise((resolve, reject) => {
        connection.query(sql, (err, _result) => {
            if (err){
                console.log(err);
                reject('failed');
            }
            resolve('ok');
        });
    })
    const queryResults = await queryPromise;
    connection.end();
    return queryResults;
}

async function getUsers(handler) {
    const sql = `SELECT * FROM people`
    const connection = mysql.createConnection(config);
    const queryPromise = new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(handler(result));
        });
    })
    connection.end();
    try {
        return await queryPromise;
    } catch (error) {
        return [];
    }
}

async function handleQuery(promiseFun){
    try{
        await promiseFun()
    }catch(_err){
        await init().then(() => promiseFun())
    }
}

app.post('/people/:name', async (req, res) => {
    const sanitizedName = (req.params.name || "").normalize('NFD').replace(/[^\w\s]/, '');
    const addUser = `INSERT INTO people(name) VALUES ('${sanitizedName}');`;
    await handleQuery(async () => await query(addUser))
    res.status(200).send('Ok')
});

app.post('/reset', async (_req, res) => {
    const deletePeopleTable = `DELETE from people`;
    await handleQuery(async () => await query(deletePeopleTable))
    await init();
    res.status(200).send('Ok')
});

app.get('/', async (_req, res) => {
    let html = '<h1>Full Cycle Rocks!</h1>';
    const handler = (result) => result && result.map ? `<ul>${result.map(people => `<li>${people.name}</li>`).join('')}</ul>` : ''
    let users = await getUsers(handler);
    if(!users?.length){ 
        users = await init().then(async () => await getUsers(handler));
    }
    res.send(html + users)
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
