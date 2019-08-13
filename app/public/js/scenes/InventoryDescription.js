
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
        self.name = new Phaser.GameObjects.Text(scene,320,-150,'',self.textStyle);
        self.look = new Phaser.GameObjects.Sprite(scene,400,-30);
        this.description = new Phaser.GameObjects.Text(scene,240,20,'',self.textStyle);
        this.description.setWordWrapWidth(350);
        self.add(self.look);
        self.add(self.name);
        self.add(self.description);
        window.addEventListener('setItemDescription',function(e){
            self.setItemDescription(e.detail);
        });
    }

    setItemDescription(item)
    {
        this.name.setText(item.name);
        this.look.setTexture('objects',item.look);
        this.look.setScale(5,5);
        this.description.setText(item.description);
    }
}