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

app.get('/attackvalue', (req,res) => {
    const attack = req.query.attack;
    connection.query('SELECT name, attack FROM pokemon WHERE attack > ?',
        [attack], (error, results) => {
            if (results.length === 0) {
                res.send('Der er ingen Pokémon med højere attack. Den højeste attack er XXX, og den laveste er XXX')
            } else {
                res.send(results);
            }

        });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



