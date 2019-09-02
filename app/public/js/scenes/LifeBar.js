class LifeBar extends Phaser.GameObjects.Container
{
    constructor(scene,x,y,max)
    {
        super(scene,x,y);
        this.max = max;
        this.life = max;
        this.barLength = 150;
        this.geometry = new Phaser.Geom.Rectangle(0,0,this.barLength,20);
        this.background = new Phaser.GameObjects.Graphics(
            scene,
            {
                x:0, y:0,
                fillStyle: { color: 0xff0000 },
                add:true
            }
        )
        this.add(this.background);
        this.bar = new Phaser.GameObjects.Graphics(
            scene,
            {
                x:0, y:0,
                fillStyle: { color: 0x32CD32 },
                add:true
            }
        )
        this.add(this.bar);
        this.background.fillRectShape(this.geometry);
        scene.add.existing(this);
    }

    setLife(life)
    {
        this.life = life;
        this.geometry.setSize(Math.round(this.life * this.barLength / this.max) , 20);
        this.bar.clear();
        this.bar.fillRectShape(this.geometry);
    }

}