class Pokemon {

    static keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false

    };

    static activePokemon = null;

    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
        this.element = this.createElement();
        this.addEventListeners();
    }
    
    createElement() {
      const img = document.createElement('img');
      img.src = this.sprite;
      img.style.position = 'absolute';
      img.style.top = Math.ceil(Math.random()*100) + 'px';
      img.style.left = Math.ceil(Math.random()*100) + 'px';

      document.body.appendChild(img);

      return img;
    }
    
    addEventListeners() {   
     	this.element.addEventListener('click', () => {
            Pokemon.activePokemon = this;
        });
    }
    
    move(step) { 
    	let top = parseInt(this.element.style.top);
      let left = parseInt(this.element.style.left);

      if (Pokemon.keys.ArrowUp) 
            this.element.style.top = (top - step) + 'px';

      if (Pokemon.keys.ArrowDown)    
            this.element.style.top = (top + step) + 'px';

      if (Pokemon.keys.ArrowLeft)
           this.element.style.left = (left - step) + 'px';

      if (Pokemon.keys.ArrowRight) 
           this.element.style.left = (left + step) + 'px';
    }
} // end of Pokemon class


document.addEventListener('keydown', function (event) {
   Pokemon.keys[event.key] = true;
});

document.addEventListener('keyup', function (event) {
  Pokemon.keys[event.key] = false;
});

function moveActivePokemon() {
   
   const step = 5;

    if (Pokemon.activePokemon) {
        Pokemon.activePokemon.move(step);
    }
}

setInterval(moveActivePokemon, 10);

// Instantiate Pokémon
const pokemonNames = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'];

function cargarJuego () {

  // llamar a loadImag

  let url = "https://preview.redd.it/dnlz6c3xni951.jpg?width=1080&crop=smart&auto=webp&s=84af1d3e4e27eddc5c612a7b75244a9886389f77"

  loadImage(url).then(img => document.body.appendChild(img)).catch(err => console.error(err));

  // Cargar los Pokemon de pokemonNames con Promise.all (NO usar forEach):
  // se lanzan todas las peticiones en paralelo y se espera a que terminen todas.
  
  url = "https://pokeapi.co/api/v2/pokemon/"

  const pokemonPromises = pokemonNames.map(name => {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error:${name}`);
                }
                return response.json();
            });
  });

  Promise.all(pokemonPromises)
        .then(pokemonsData => {
            pokemonsData.forEach(data => {
                const sprite = data.sprites.front_default;
                new Pokemon(data.name, sprite);
            });
        })
        .catch(err => console.error("Erro ao cargar os Pokémon iniciais:", err));
}

function loadImage (url) {
  return new Promise ((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.width;
    image.height;

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject("No load"));
  });
}

function buscarPokemon() {
  const input = document.body.getElementsByTagName('input')[0];
  const checkboxShiny = document.getElementById('shiny');

  if (!input || !input.value.trim()) return;
  
  const pokemonName = input.value.trim().toLowerCase();

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Pokémon no encontrado");
            }
            return response.json();
        })
        .then(data => {
            const isShiny = checkboxShiny && checkboxShiny.checked;
            const sprite = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

            if (!sprite) {
              alert("No hay sprite")
              return;
            }

            new Pokemon(data.name, sprite);
            input.value = '';
        })
        .catch(err => {
            console.error(err);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarJuego();

    const btn = document.getElementById('buscarPokemon');
    if (btn) {
        btn.addEventListener('click', buscarPokemon);
    }
});