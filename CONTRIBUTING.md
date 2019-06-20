<h1 align="center">Contributing</h1>

I need you for sprite naming !

The folder app/assets/sprites contains sprites information about each pokemon.

To display a pokemon, I need: 

  - Sprites about it. In general, resource files that I found contain sprites for moving, sleeping, being hurt, and attacking (both basic and special attack).
  - a JSON sprite map to tell the engine where to find the sprites.
 
I choose to have one tileset per pokemon. A tileset is a JSON object with the format "JSON TP Array".
 
For example, you will find in the folder app/assets/sprites/1:

  - a PNG image containing all sprites of Bulbasaur (cause its pokedex number is 1).
  - a JSON object containing information that will be read by the game engine, telling it where the different sprites are.

Ressources sprites have already been ripped from [spriters-resource.com](https://www.spriters-resource.com/ds_dsi/pokemonmysterydungeonexplorersoftimedarkness/).
 
A ripped sprite sheet looks like that:

<p align="center">
  <img src="/screenshot/farfetchd.png" alt="farfetchd sprites">
</p>

Unfortunately, ripped sprite sheets available on spriter-resource can not be used directly, so I need to do some preprocessing stuff before being able to use it.

## Contributing by doing Tileset standardisation

Choose a pokemon that has not already its sprite sheet inside a folder located in the app/assets/sprites directory.

In the following tutorial, I will use the example of farfetchd.

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

To begin this step, you should have:

 - a folder in app/assets/sprites named with the pokedex number of the pokemon.
 - inside this folder, a .png picture contaning sprites that I want to display.

I will now create a .JSON tileset with the format JSON TP Array. JSON TP Array is the output format of the software TexturePacker and it can be easily completed to fit the input tileset format of Phaser, the framework that I use client side to display the game in a canvas.

Unfortunately, TexturePacker is not a free software. Moreover, it can only cut spritesheets with regular width, height, margin and padding. So this is definitly not the tool that I want to use here.

I will use instead an online editor called [leshylabs/sstool](https://www.leshylabs.com/apps/sstool/). It proposes multipes usefull functions to help up in our journey to the sprite sheet classification.

As a first step, drag and drop the picture on the editor. You should now have something like this.

<p align="center">
  <img src="/screenshot/raw.PNG" alt="raw sstool sprites">
</p>

You maybe noticed that for now, the picture is interpreted as one big sprite. Thats obviously not what I want. To correct that, click on the remap button. Now, every sprite should be separated like this (if you want to have the gray border for each sprite, check "show outline"): 

<p align="center">
  <img src="/screenshot/separate.PNG" alt="separate sstool sprites">
</p>

If you click on each sprite, you will see that the sprite name is a number that doesnt help us that much. I would rather prefered have a name "this is the second farfetchd moving down sprite" or, on the example above "this is the second physical attack sprite for farfetchd". As its a bit too long for a name, i introduce a notation.

Each sprite will be named a_b_c_d. And a,b,c,d will be replaced by following those rules.

 - **a** is the pokedex number of the pokemon. For farfetchd, a = 83
 - **b** is the action that the pokemon is doing. It could be :
    - **0** : move
    - **1** : Physical attack
    - **2** : Special attack
    - **3** : Hurt
    - **4** : Asleep
 - **c** is the pokemon orientation. It could be :
    - **0** : down
    - **1** : left down
    - **2** : left
    - **3** : left up
    - **4** : up
  - **d** is the index of the sprite. For example, there is usualy 3 sprites for moving. So there will be 3 index: 0, 1, 2.

  You might wonder where is the right direction. As the immense majority of pokemon have a vertical symmetry, we don't need the right direction sprites. Instead, we take the left down, left, left up sprites and we mirror them around the vertical axis. This way we have right sprites without having to load them.

  Unfortunately for this tutorial, fartechd is one the few pokemons that don't have a vertical symmetry. So, for now, we will delete right sprites from the sprite sheet by clicking on the sprite and then clicking on delete. After sprite suppression, you should have something like that.

<p align="center">
  <img src="/screenshot/rightSuppresion.PNG" alt="rightSuppresion sprites">
</p>

Now, we can start to rename every remaining sprites. Usually, they are displayed like that :

<p align="center">
  <img src="/screenshot/catalogue.PNG" alt="catalogue sprites">
</p>

Start with the portrait. Click on the portrait and rename it 'portrait'.
Then continue with the sleep sprite. For each pokemon, there is only 2 sprites. For the immense part of them, they have a left down orientation. So, as an arbitrary rule, we will consider that the sleeping sprites are always facing left down, even if that is not the case. For example, here farfetchd sleeping sprite have a down right orientation. But we will consider them with a left down orentation. Here the two names will be:

- 83(pokemon index) _ 4(sleep code) _ 1 (Sleep sprite always considered as left down) _ 0 (index 0)
- 83_4_1_1 (index 1)

Then the hurt sprite:

 - 83_3_0_0
 - 83_3_1_0
 - 83_3_2_0
 - 83_3_3_0
 - 83_3_4_0

 Then the move sprite:
 
  facing down:
  - 83_0_0_0
  - 83_0_0_1
  - 83_0_0_2

  facing up:
  - 83_0_4_0
  - 83_0_4_1
  - 83_0_4_2

  facing left:
  - 83_0_2_0
  - 83_0_2_1
  - 83_0_2_2

  facing left down:
  - 83_0_1_0
  - 83_0_1_1
  - 83_0_1_2

  facing left up:
  - 83_0_3_0
  - 83_0_3_1
  - 83_0_3_2

  Then the physcial attack:

  - 83_1_0_0
  - 83_1_0_1

  - 83_1_1_0
  - 83_1_1_1

  - 83_1_2_0
  - 83_1_2_1

  - 83_1_3_0
  - 83_1_3_1
  
  - 83_1_4_0
  - 83_1_4_1

  And finally the special attack:

  - 83_2_0_0
  - 83_2_1_0
  - 83_2_2_0
  - 83_2_3_0
  - 83_2_4_0

Now we are almost done.
You should have something like this.

<p align="center">
  <img src="/screenshot/finish.PNG" alt="finish sprites">
</p>

You can check that you have classified all sprites by checking "show labels" and see that you now have only a_b_c_d names. To double check, you can scroll down the list "Sprite map"n you should only see a_b_c_d names.

Now, you maybe noticed that there is lots of empty spaces in the spritesheet. To avoid that we will use the function "Optimize" of leeshy labs. Click "Optimize" button, it will rearrange all the sprites by finding a more dense layout.

<p align="center">
  <img src="/screenshot/optimize.PNG" alt="optimize sprites">
</p>

Save your new optimized spritesheet as pokedex_number.png, here 83.png.
Select JSON TP Array format and save the json file as pokedex_number.json, here 83.json.

<p align="center">
  <img src="/screenshot/save.PNG" alt="save sprites">
</p>

Move the downloaded picture and json to the app/assets/sprites/pokedex_number folder and add the json and replace the old spritesheet by the new optimized one.

Commit & Push. If you don't have right for push, do a pull request.

