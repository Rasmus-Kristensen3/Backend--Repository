/* env example
DBHOST=localhost
DBUSER=root
DBPASSWORD=din_adgangskode
DBDATABASE=pokemon
PORT=3000
*/
require("dotenv").config();

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

connection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Forbundet til databasen!");
    }
});

// liste over alle Pokémon med deres navne og stats.
app.get('/allpokemon',(req, res) => {
    connection.query('SELECT name FROM pokemon',(error,results) => {
        res.send(results);
    });
});

// pokemon 1 Filtrer efter deres attack værdi )
app.get('/attackvalue', (req,res) => {
    const attack = req.query.attack;
    connection.query('SELECT * FROM pokemon WHERE attack > ?',
        [attack], (error, results) => {
            if (results.length === 0) {
                res.send('Der er ingen Pokémon med højere attack. Den højeste attack er XXX, og den laveste er XXX')
            } else {
                res.send(results);
            }

        });
});

// pokemon 2 Filtrer efter deres primary type)
app.get('/primarytype', (req,res) =>{
    const type = req.query.type;
    connection.query('SELECT * FROM pokemon WHERE primary_type = ?',
        [type],
        (error,results) => {
        if (results.length === 0) {
            res.send('Der blev ikke fundet nogen Pokémon med denne type')
        } else {
            res.send(results);
        }
        });
});



// 2. Trainer

app.get('/alltrainers', (req, res) =>{
    connection.query('select trainer_name as name,age, hometown from trainer',
        (error, results) =>{
        res.send(results);
        })})

// test
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



