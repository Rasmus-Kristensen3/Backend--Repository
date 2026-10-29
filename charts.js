
// Chart 1:  En liste over Pokemons med gennemsnitlige samlede stats, DESC liste.

fetch('http://localhost:3000/higheststatpokemons')
    .then(response => response.json())
    .then(data => {
        new Chart(document.getElementById('highestStatsChart'), {
            type: 'bar',
            data: {
                labels: data.map(pokemon => pokemon.name),
                datasets: [{
                    label: 'Average Stats',
                    data: data.map(pokemon => pokemon.Average_Stats)
                }]
            },
            options: {
                responsive: true
            }
        });
    })
    .catch(error => console.error('Error loading Pokémon chart:', error));


// Chart 2: Hvilke trainers har flest Pokémon?

fetch('http://localhost:3000/chartfortrainersxpokemons')
    .then(response => response.json())
    .then(data => {
        new Chart(document.getElementById('trainerPokemonChart'), {
            type: 'bar',
            data: {
                labels: data.map(trainer => `Trainer ${trainer.trainer_id}`),
                datasets: [{
                    label: 'Number of Pokémon',
                    data: data.map(trainer => trainer.number_of_pokemon)
                }]
            },
            options: {
                responsive: true
            }
        });
    })
    .catch(error => console.error('Error loading trainer chart:', error));