class Move{
    constructor(name, url, levelLearnedAt, moveLearnMethod){
        this.name = name;
        this.url = url;
        this.levelLearnedAt = levelLearnedAt;
        this.moveLearnMethod = {
            name: "",
            url: ""
        }
        this.moveLearnMethod.name = moveLearnMethod.name;
        this.moveLearnMethod.url = moveLearnMethod.url;
    }
}
module.exports = Move;