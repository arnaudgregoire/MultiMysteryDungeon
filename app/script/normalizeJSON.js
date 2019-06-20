const fs = require('fs');


function normalize(pokedex_number){
    let content = fs.readFileSync("../assets/sprites/" + pokedex_number + "/" + pokedex_number + ".json");
    let json = JSON.parse(content);
    let normalizedJSON = {"textures": [{}]};
    normalizedJSON.textures[0].image = "../../assets/sprites/" + pokedex_number + "/" + pokedex_number + ".png";
    normalizedJSON.textures[0].format = "RGBA8888";
    normalizedJSON.textures[0].size = json.meta.size;
    normalizedJSON.textures[0].scale = 1;
    normalizedJSON.textures[0].frames = json.frames;

    let stream = fs.createWriteStream('../assets/sprites/' + pokedex_number + '/' + pokedex_number + ".json");
    stream.once('open', function(fd) {
    stream.write(JSON.stringify(normalizedJSON));
    stream.end();
    });
}

[4,83,142,144].forEach((number)=>{
    normalize(number);
})


