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
app.use(express.json());

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

    connection.query('SELECT * FROM pokemon',(error,results) => {
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

// pokemon 3 Filtrer søgning efter navn)
app.get('/pokemonname', (req,res) => {
    const nameopg3 = req.query.name;
    connection.query('SELECT * FROM pokemon WHERE name = ?',
        [nameopg3],
        (error,results) => {
        if (results.length === 0) {
            res.send('Der blev ikke fundet nogen Pokémon med dette navn')
        } else {
            res.send(results);
        }
        });
});

// 2. Trainer

// 1) liste over alle trainers
app.get('/alltrainers', (req, res) =>{
    connection.query('select trainer_id ,trainer_name as name,age, hometown from trainer',
        (error, results) =>{
        res.send(results);
        })})

// 2) se hvilke pokemon en bestemt trainer ejer
app.get('/pokemontrainersown', (req,res) =>{
    const whichTrainerOwnsWhatPokemonParameter = req.query.trainer_name;
    connection.query('select pokemon.name from pokemon inner join trainer_pokemon on pokemon.pokedex_number = trainer_pokemon.pokedex_number inner join trainer on trainer_pokemon.trainer_id = trainer.trainer_id where trainer_name = ?',
        [whichTrainerOwnsWhatPokemonParameter], (error, results) =>{
res.send(results)
    })})



// Oprette en ny trainer.
app.post("/trainer/new", (req,res) =>{
    const trainer_name = req.body.trainer_name
    const hometown = req.body.hometown
    const age = req.body.age

    connection.query(
        "INSERT INTO trainer (trainer_name, hometown, age) VALUES (?,?,?)",
        [trainer_name, hometown, age],
        (error, results) =>{
            res.send("New Trainer Created")
        }
    )
})

// Tilføje en Pokémon til en trainer.
app.post("/trainer/add", (req,res) =>{
    const trainerId = req.body.trainer_id
    const pokemonId = req.body.pokedex_number

    connection.query(
        "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?,?)",
        [trainerId, pokemonId],
        (error,results) =>{
            if (error) {
                console.log(error);
                return res.status(500).send("Fejl: Pokemon blev ikke tilføjet");
            }
            res.send("Pokemon added to trainer")
        })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Hvilken Pokémon har den højeste speed?
app.get("/pokemon/fastest", (req, res)=> {
    connection.query(
        `SELECT *
         FROM pokemon
         ORDER BY speed DESC LIMIT 1;`,
        (error, result) => {
            res.send(result);
        });
});

app.get('/pokemon/lowest-speed', (req, res) => {
    connection.query(
        `SELECT primary_type, AVG(speed) AS avg_speed
         FROM pokemon
         GROUP BY primary_type
         ORDER BY avg_speed ASC;`,
        (error, results) => {
            if (error) return res.status(500).send(error.message);
            res.send(results);
        }
    );
});

app.get('/stats/average-attack-per-attack',(req, res)=>{
    connection.query(
        `SELECT primary_type, AVG(attack) AS avg_attack
         FROM pokemon
         GROUP BY primary_type
         ORDER BY avg_attack ASC;`,
        (error, results) => {
            if (error) return res.status(500).send(error.message);
            res.send(results);
        }
    );
});





// 3. DASHBOARD
// Hvilke trainers har flest Pokémon?

app.get('/chartfortrainersxpokemons', (req,res) =>{
    connection.query('SELECT trainer_id,COUNT(*) AS number_of_pokemon FROM trainer_pokemon GROUP BY trainer_id ORDER BY number_of_pokemon DESC',
        (error, results) =>{
            res.send(results)
        }
    );
});

// En liste over Pokemons med gennemsnitlige samlede stats, DESC liste.

app.get('/higheststatpokemons', (req, res) =>{
   connection.query('SELECT name,ROUND((speed + special_defence + special_attack + defence + attack + hp) / 6, 2) AS Average_Stats FROM pokemon ORDER BY Average_Stats DESC LIMIT 20',
       (error, results) =>{
           res.send(results)
       }
   );
});


// Moves api

app.get("/howmanypokemonmoves", (req, res)=> {
    connection.query('select count(move_name) as Moves from move', (error, results) =>{
        res.send(results)
        })})













// hvor mange pokemon i databasen
app.get("/howmanypokemon", (req, res) =>{
    connection.query('select count(pokedex_number) as TotalPokemon from pokemon', (error, results) =>{
        res.send(results)
        })})