/* env example
DBHOST=localhost
DBUSER=root
DBPASSWORD=din_adgangskode
DBDATABASE=pokemon
PORT=3000
*/
require("dotenv").config();

console.log(process.env.DBUSER);


//npm install express --save
const express = require("express");
//npm install mysql2 --save
const mysql = require("mysql2");
//npm install cors --save
const cors = require("cors");

const app = express();

const port = 3000;

app.use(cors());

//Host, user, password database
const connection = mysql.createConnection({
    //process.env.KEYWORD
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

app.get('/all',(req, res) => {
    connection.query('SELECT name FROM pokemon',(error,results) => {
        res.send(results);
    });
});




// 2. Trainer
app.get('/alltrainers', (req, res) =>{
    connection.query('select trainer_name as name,age, hometown from trainer',
        (error, results) =>{
        res.send(results);
        })})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



