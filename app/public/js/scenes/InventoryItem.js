class InventoryItem extends Phaser.GameObjects.Container
{
    constructor(scene,x,y,item)
    {
        super(scene,x,y);
        this.item = item;
        this.background = new Phaser.GameObjects.Image(scene,0,0,'whiteBackground');
        this.add(this.background);
        this.add(new Phaser.GameObjects.Sprite(scene,0,0,'objects',item.look).setScale(3,3));
        this.setSize(50,50);
        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => this.enterButtonHoverState() );
    }

    enterButtonHoverState() {
      let self = this;
      self.background.setTexture('yellowBackground');
      window.dispatchEvent(new CustomEvent('setItemDescription',{detail:self.item}));
    }
    
      enterButtonRestState() {
        this.background.setTexture('whiteBackground');
    }
    
    enterButtonActiveState() {
      let self = this;
      window.dispatchEvent(new CustomEvent('item-click',{detail:self.item}));
    }

}