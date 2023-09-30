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

async function init (){
    const sqlTable = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`;
    await query(sqlTable)

    const addUsers = `INSERT INTO people(name) VALUES ('Andrew'), ('Joao'), ('Maria');`;
    await query(addUsers)
    return;
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

async function getUser(sql, handler) {
    const connection = mysql.createConnection(config);
    const queryPromise = new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(handler(result));
        });
    })
    const queryResults = await queryPromise;
    connection.end();
    return queryResults;
}

app.post('/people/:name', async (req, res) => {
    const sanitizedName = (req.params.name || "").normalize('NFD').replace(/[^\w\s]/, '');
    const addUser = `INSERT INTO people(name) VALUES ('${sanitizedName}');`;
    await query(addUser)
    res.status(200).send('Ok')
});

app.post('/reset', async (_req, res) => {
    const sqlTable = `DELETE from people`;
    await query(sqlTable)
    res.status(200).send('Ok')
});

app.get('/', async (_req, res) => {
    let html = '<h1>Full Cycle Rocks!</h1>';
    const sql = `SELECT * FROM people`
    const handler = (result) => `<ul>${result.map(people => `<li>${people.name}</li>`).join('')}</ul>`
    let users = await getUser(sql, handler);
    if(!users) {
        init()
        users = await getUser(sql, handler);
    }
    res.send(html + users)
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
