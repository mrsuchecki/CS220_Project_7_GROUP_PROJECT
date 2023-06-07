// Our program fetches from two different endpoints of the PokeAPI: /pokemon and /ability
// The user starts by typing the name of a Pokemon into the command line to fetch from the /pokemon endpoint
// The program will display the Pokemon's six base stats (hp, atk, def, sp. atk, sp. def, speed), and calculate and display its average base stat
// The program will also display a list of the Pokemon's abilities
// For each ability, another fetch will be made from the /ability endpoint, to count and display the Pokemon which share the queried Pokemon's abilities

import { fetchJSON } from "../include/fetchJSON.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

interface Pokemon {
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface Ability {
  pokemon: { pokemon: { name: string } }[];
}

// parse user input from stdin and convert to lowercase
const rl = readline.createInterface({ input, output });
const pokemonName = await rl
  .question("What Pokemon would you like to view stats and abilities for? ")
  .then(res => res.toLowerCase());
rl.close();

// variable to store array of ability names for printing
let abilityNames: string[];

// fetch from /pokemon endpoint
fetchJSON<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  .then(response => {
    // display base stats and calculated average
    console.log(`${pokemonName} has the following base stats:`);
    const avg =
      response.stats.reduce((sum, elem) => {
        console.log(`${elem.stat.name}: ${elem.base_stat}`);
        return (sum += elem.base_stat);
      }, 0) / 6;
    console.log(`${pokemonName} has an average base stat value of ${avg}`);

    // list the abilities
    const numAbilities = response.abilities.length;
    console.log(`${pokemonName} has ${numAbilities} different abilities:`);
    abilityNames = response.abilities.map(ability => ability.ability.name);
    console.log(abilityNames);
    return abilityNames;
  })
  .then(abilityNames => {
    // fetch from /ability endpoint using array of ability names
    return Promise.all(abilityNames.map(name => fetchJSON<Ability>(`https://pokeapi.co/api/v2/ability/${name}`)));
  })
  .then(abilities => {
    // display number of Pokemon which share each ability, and the lists of these Pokemon
    abilities.forEach((ability, index) => {
      const sharedBy = ability.pokemon.map(elem => elem.pokemon.name);
      console.log(`${abilityNames[index]} is shared by ${sharedBy.length} Pokemon:`);
      console.log(sharedBy);
    });
  })
  // error handling for invalid Pokemon name
  .catch(() => console.log(`${pokemonName} is not a valid Pokemon name`));
