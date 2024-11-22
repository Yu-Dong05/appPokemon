//Elementi della pagina
const pokedexListContainer = document.getElementById('pokedex-list')
const notifyMessageModalLabel = document.getElementById('notifyMessageModalLabel')
const notifyMessage = document.getElementById('notifyMessage')
const notifyMessageImage = document.getElementById('notifyMessageImage')

//Funzione per caricare e mostrare i Pokémon catturati
function loadPokedex() {
    //Recupero i Pokémon catturati dal localStorage
    const myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || []
    const limitMessage = document.getElementById('pokedex-limit-message')

    //Resetto il contenitore dei Pokémon
    pokedexListContainer.innerHTML = ''

    //Controllo se non ci sono Pokémon catturati
    if (myPokemon.length === 0) {
        pokedexListContainer.innerHTML = `
            <div class="col-md-4 text-center">
                <div class="card mb-3 project-card shadow-sm">
                    <div class="card-body">
                        <h4 class="card-title card-title-bold mb-3">Pokédex</h4>
                        <p class="card-text text-muted">
                            Non hai ancora catturato nessun Pokémon.<br> 
                            Vai alla pagina 'All Pokémon' per catturarne qualcuno!
                        </p>
                        <a href="pokemon.html" class="btn btn-primary btn-lg">All Pokémon</a>
                    </div>
                </div>
            </div>`
        limitMessage.innerHTML = '' 
        return
    }

    //Mostro ogni Pokémon catturato
    myPokemon.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card', 'col-md-3', 'm-2', 'p-2', 'text-center');

        pokemonCard.innerHTML = `
            <h5 class="card-title" style="font-family: 'Gloria Hallelujah', cursive; font-size: 20px;">
                ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h5>
            <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-img my-3" style="max-width: 100px;">
            <button class="release-btn btn-sm mt-2" onclick="releasePokemon('${pokemon.name}', '${pokemon.image}')">Release</button>
        `

        //Aggiungo un evento click sull'immagine per mostrare i dettagli del Pokémon
        pokemonCard.querySelector('img').addEventListener('click', function () {
            showPokemonDetails(pokemon)
        })

        pokedexListContainer.appendChild(pokemonCard)
    })

    //Controllo se è stato raggiunto il limite massimo di Pokémon
    if (myPokemon.length >= 12) {
        limitMessage.innerHTML = '<p class="text-danger">Hai raggiunto il limite massimo di Pokémon nel tuo Pokédex!</p>'
    } else {
        let message = `Attualmente hai ${myPokemon.length} Pokémon. Ne puoi catturare ancora ${12 - myPokemon.length}.`
        limitMessage.innerHTML = `<p class="text text-body">${message}</p>`
    }
}

//Funzione per mostrare i dettagli di un Pokémon 
function showPokemonDetails(pokemon) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('pokemonDetailsModalLabel').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            document.getElementById('pokemonDetailImage').src = pokemon.image
            document.getElementById('pokemonType').textContent = `Type: ${data.types.map(type => type.type.name).join(', ')}`
            document.getElementById('pokemonAbilities').textContent = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}`
            document.getElementById('pokemonHeight').textContent = `Height: ${data.height / 10} m`
            document.getElementById('pokemonWeight').textContent = `Weight: ${data.weight / 10} kg`

            const myModal = new bootstrap.Modal(document.getElementById('pokemonDetailsModal'))
            myModal.show()
        })
        .catch(error => {
            console.error('Errore durante il recupero dei dettagli del Pokémon:', error)
        })
}

//Funzione per rilasciare un Pokémon dal Pokédex
function releasePokemon(name, image) {
    let myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || []

    //Filtro l'elenco dei Pokémon per escludere quello rilasciato
    myPokemon = myPokemon.filter(pokemon => pokemon.name !== name)

    //Aggiorno il localStorage
    localStorage.setItem('myPokemon', JSON.stringify(myPokemon))

    //Notifica per indicare che il Pokémon è stato rilasciato
    notifyMessage.classList.forEach(Class => notifyMessage.classList.remove(Class))

    notifyMessageModalLabel.textContent = "Pokémon Released"
    notifyMessage.classList.add('text-warning')
    notifyMessage.textContent = `${name} è stato rilasciato e non è più nel tuo Pokédex.`
    notifyMessageImage.src = image

    const myModal = new bootstrap.Modal(document.getElementById('notifyMessageModal'))
    myModal.show()

    //Ricarico il Pokédex
    loadPokedex()
}

//Inizializzo Pokédex
loadPokedex()