const Entity = require("./entity");

class Ia extends Entity{
    constructor(x, y, name, pokemon){
      super(x,y,name);
      this.pokemon = pokemon;
    }
  }

  module.exports = Ia;