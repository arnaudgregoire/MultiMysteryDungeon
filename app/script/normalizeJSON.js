const fs = require('fs');


function normalize(pokedex_number){
    console.log(pokedex_number);
    let path = "../assets/sprites/" + pokedex_number + "/" + pokedex_number;

    try {
        if (fs.existsSync(path + ".json")) {
            let content = fs.readFileSync( path + ".json");
            let json = JSON.parse(content);
            if(!json.hasOwnProperty("textures")){
                let normalizedJSON = {"textures": [{
                    image:"",
                    format:"RGBA8888",
                    size:{},
                    scale:1,
                    frames:{}
                }]};
                normalizedJSON.textures[0].image = path + ".png";
                normalizedJSON.textures[0].size = json.meta.size;
                normalizedJSON.textures[0].frames = json.frames;
            
                let stream = fs.createWriteStream(path + ".json");
                stream.once('open', function(fd) {
                stream.write(JSON.stringify(normalizedJSON));
                stream.end();
                });
                console.log('new JSON ( ' + path + '.json' + ' ) created');
            }
            else{
                console.log('JSON ( ' + path + '.json' + ' ) has already a good format');
            }
        }
      } catch(err) {
        console.log("file " + path + ".json does not exist");
      }
}

const args = process.argv.slice(2)

normalize(parseInt(args[0]));


