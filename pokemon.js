//Elementi della pagina
const pokemonListContainer = document.getElementById('pokemon-list')
const notifyMessageModalLabel = document.getElementById('notifyMessageModalLabel') 
const notifyMessage = document.getElementById('notifyMessage')
const notifyMessageImage = document.getElementById('notifyMessageImage')

//Variabili globali
let myPokemon = JSON.parse(localStorage.getItem('myPokemon')) || [] //Lista dei Pokémon catturati, salvata in localStorage
let offset = 0 //Offset per la paginazione della lista Pokémon
const limit = 12 //Numero massimo di Pokémon mostrati per pagina

/**
 * Carica la lista dei Pokémon dal server
 * @param {number} offset - Offset per la paginazione
 */
function loadPokemon(offset) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossibile caricare la lista Pokémon')
            }
            return response.json()
        })
        .then(data => {
            displayPokemonList(data.results)
        })
        .catch(error => {
            alert('Errore nel caricamento della lista Pokémon: ' + error.message)
        })
}

/**
 * Mostra la lista dei Pokémon nella pagina
 * @param {Array} pokemonList - Lista dei Pokémon ottenuta dall'API
 */
function displayPokemonList(pokemonList) {
    pokemonListContainer.innerHTML = ''
    pokemonList.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Impossibile caricare i dati del Pokémon')
                }
                return response.json()
            })
            .then(data => {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card', 'col-md-3', 'm-2', 'p-2', 'text-center')

                //Contenuto della card del Pokémon
                pokemonCard.innerHTML = `
                    <h5 class="card-title" style="font-family: 'Gloria Hallelujah', cursive; font-size: 20px;">
                        ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                    </h5>
                    <img src="${data.sprites.front_default}" class="pokemon-img my-3" style="max-width: 100px; cursor: pointer;" 
                        onclick="showPokemonDetails('${data.name}')">
                    <button class="btn btn-primary btn-sm catch-btn mt-2" 
                        onclick="catchPokemon('${data.name}', '${data.sprites.front_default}')">Catch</button>
                `
                pokemonListContainer.appendChild(pokemonCard)
            })
            .catch(error => {
                console.error('Errore nel caricamento del Pokémon: ', error)
            })
    })
}

/**
 * Aggiunge un Pokémon al Pokédex
 * @param {string} name - Nome del Pokémon
 * @param {string} image - URL dell'immagine del Pokémon
 */
function catchPokemon(name, image) {
    notifyMessage.classList.forEach(Class => notifyMessage.classList.remove(Class)) //Reset della classe e immagine del messaggio
    notifyMessageImage.src = ""

    //Controllo se il Pokémon è già stato catturato
    if (!myPokemon.find(p => p.name === name)) {
        if (myPokemon.length >= 12) {
            showNotification("Uh oh!", "Hai già 12 Pokémon nel tuo Pokédex!", 'text-warning')
            return
        }

        //Aggiungo il Pokémon al Pokédex
        myPokemon.push({ name, image })
        localStorage.setItem('myPokemon', JSON.stringify(myPokemon))

        //Notifica di successo
        showNotification("Success!", `${name} è stato catturato e aggiunto al tuo Pokédex!`, 'text-success', image)
    } else {
        //Notifica di Pokémon già presente
        showNotification("Uh oh!", `${name} è già presente nel tuo Pokédex.`, 'text-warning', image)
    }
}

/**
 * Mostra i dettagli di un Pokémon 
 * @param {string} name - Nome del Pokémon
 */
function showPokemonDetails(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossibile caricare i dettagli del Pokémon')
            }
            return response.json()
        })
        .then(data => {
            document.getElementById('pokemonDetailsModalLabel').textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1)
            document.getElementById('pokemonDetailImage').src = data.sprites.front_default
            document.getElementById('pokemonType').textContent = `Tipo: ${data.types.map(t => t.type.name).join(', ')}`
            document.getElementById('pokemonAbilities').textContent = `Abilità: ${data.abilities.map(a => a.ability.name).join(', ')}`
            document.getElementById('pokemonHeight').textContent = `Altezza: ${data.height / 10}m`
            document.getElementById('pokemonWeight').textContent = `Peso: ${data.weight / 10}kg`

            var myModal = new bootstrap.Modal(document.getElementById('pokemonDetailsModal'))
            myModal.show()
        })
        .catch(error => {
            showNotification("Errore ", error.message, 'text-danger')
        })
}

/**
 * Mostra una notifica nel Modal
 * @param {string} title - Titolo del messaggio
 * @param {string} message - Contenuto del messaggio
 * @param {string} className - Classe CSS per lo stile del messaggio
 * @param {string} [image] - Immagine da mostrare nella notifica
 */
function showNotification(title, message, className, image = "") {
    notifyMessageModalLabel.textContent = title
    notifyMessage.classList.add(className)
    notifyMessage.textContent = message
    notifyMessageImage.src = image

    var myModal = new bootstrap.Modal(document.getElementById('notifyMessageModal'))
    myModal.show()
}

//Gestione dei pulsanti per andare avanti e indietro
document.getElementById('next-btn').addEventListener('click', () => {
    offset += limit
    loadPokemon(offset)
})

document.getElementById('prev-btn').addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit
        loadPokemon(offset)
    }
})

//Inizializzazione e caricamento dei Pokémon
loadPokemon(offset)