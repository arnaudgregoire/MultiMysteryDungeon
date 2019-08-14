class InventoryDescription extends Phaser.GameObjects.Container
{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        let self = this;    
        self.textStyle = 
        {
          fontSize: "30px",
          fontFamily: "Verdana",
          color: "white",
          align: "center"
        };
        self.greenTextStyle =
        {
            fontSize: "30px",
            fontFamily: "Verdana",
            color: "lightgreen",
            align: "center"
        };
        self.blueTextStyle = 
        {
            fontSize: "30px",
            fontFamily: "Verdana",
            color: "darkblue",
            align: "center"
        };
        self.purpleTextStyle = 
        {
            fontSize: "30px",
            fontFamily: "Verdana",
            color: "purple",
            align: "center"
        };
        self.orangeTextStyle = 
        {
            fontSize: "30px",
            fontFamily: "Verdana",
            color: "orange",
            align: "center"
        };
        self.name = new Phaser.GameObjects.Text(scene,320,-180,'',self.textStyle);
        self.look = new Phaser.GameObjects.Sprite(scene,400,-100);
        self.description = new Phaser.GameObjects.Text(scene,240,20,'',self.textStyle);
        self.description.setWordWrapWidth(350);
        self.rarity = new Phaser.GameObjects.Text(scene,320,-50,'', self.textStyle);
        self.add(self.look);
        self.add(self.name);
        self.add(self.description);
        self.add(self.rarity);
    }

    setItemDescription(item)
    {
        this.name.setText(item.name);
        this.look.setTexture('objects',item.look);
        this.look.setScale(5,5);
        this.description.setText(item.description);
        switch (item.rarity) {
            case 'COMMON':
                this.rarity.setStyle(this.textStyle);
                break;
        
            case 'UNCOMMON':
                this.rarity.setStyle(this.greenTextStyle);
                break;

            case 'RARE':
                this.rarity.setStyle(this.blueTextStyle);
                break;

            case 'EPIC':
                this.rarity.setStyle(this.purpleTextStyle);
                break;

            case 'LEGENDARY':
                this.rarity.setStyle(this.orangeTextStyle);
                break;
                        
            default:
                break;
        }
        this.rarity.setText(item.rarity);
    }
}