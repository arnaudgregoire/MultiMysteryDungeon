<h1 align="center">Contributing</h1>

We need you for sprite naming !

The folder app/assets/sprites contains sprites information about each pokemon.

To display a pokemon, we need: 

  - Sprites about it. In general, resource files that we found contain sprites for moving, sleeping, being hurt, and attacking (both basic and special attack).
  - a JSON sprite map to tell the engine where to find the sprites.
 
We choose to have one tileset per pokemon. A tileset is a JSON object with the format "JSON TP Array".
 
For example, you will find in the folder app/assets/sprites/1:

  - a PNG image containing all sprites of Bulbasaur (cause its pokedex number is 1).
  - a JSON object containing information that will be read by the game engine, telling it where the different sprites are.

Ressources sprites have already been ripped from [spriters-resource.com](https://www.spriters-resource.com/ds_dsi/pokemonmysterydungeonexplorersoftimedarkness/).
 
A ripped sprite sheet looks like that:

<p align="center">
  <img src="/screenshot/farfetchd.png" alt="farfetchd sprites">
</p>

Unfortunately, ripped sprite sheets available on spriter-resource can not be used directly, so we need to do some preprocessing stuff before being able to use it.

## Contributing by doing Tileset standardisation

Choose a pokemon that has not already its sprite sheet inside a folder located in the app/assets/sprites directory.

In the following tutorial, we will use the example of farfetchd.

### Step 1: PNG

You can download the sprite sheet by clicking "Download this Sheet" on [spriters-resource.com](https://www.spriters-resource.com/ds_dsi/pokemonmysterydungeonexplorersoftimedarkness/).

<p align="center">
  <img src="/screenshot/downloadThisSheet.PNG" alt="farfetchd sprites">
</p>

Please follow the following guideline:

  - open GIMP (if you don't already have GIMP, install it)
    **If you don't have GIMP installed and you don't know how to proceed, please press Alt+F4 to quick install it and open an issue indicating your ip adress for future blacklist.**
  - drag and drop the picture in gimp
  - `selection by color`
  - left click on the background
  - open the `Layer` menu
  - `transparency tab`
  - add an alpha canal function
  - press delete 

Now, you should have a transparent background and all the sprite selected ; something like that:

<p align="center">
  <img src="/screenshot/transparentBackground.PNG" alt="transparentBackground sprites">
</p>

Now :

  - remove the text
  - remove the credit
  - remove next pokemon and other shenanigans
  - delete `attack`, `special attack` columns 2, 3 etc..
  - shift + C, select only the chosen pokemon sprites (in case of multiple pokemons on the same sprite sheet) and then press enter

<p align="center">
  <img src="/screenshot/allStepDown.PNG" alt="allStepDown sprites">
</p>

  - export as PNG (naming it after the pokedex number of the pokemon, e.g. 1 for Bulbasaur)
  - create a folder at app/assets/sprites with the pokedex number of the pokemon.
  - move your created picture in the created folder

<p align="center">
  <img src="/screenshot/saveAs.PNG" alt="saveAs sprites">
</p>

### Step 2: JSON

#### Generating it using Tile

**\\\\ TODO**

#### Format it

Go to [SpriteSheet Tool](https://www.leshylabs.com/apps/sstool/).

Drag and drop both your PNG and JSON file.

Then, rename the pokemon sprite that have a "spriteXXX" name following this pattern: *a_b_c_d*

  - Replace 'a' with the pokedex number of the pokemon. For example, charmander value will be "4"
  - Replace 'b' with the number:
    - 0 for a movement sprite
    - 1 for a physical attack sprite
    - 2 for a special attack sprite
    - 3 for a hurt sprite
    - 4 for a sleep sprite
  - Replace 'c' with the number:
    - 0 for down
    - 1 for left down
    - 2 for left
    - 3 for left up
    - 4 for up
  - Replace 'd' with the sprite number. For example: there is three sprites moving left, so their number will be (resp.) 0-1-2. If only one sprite fit the category, the number would be zero.

### Step 3: Commit

Commit and push what you just did. If you don't have right to push, do a good old pull request.
