class InventoryUI extends Phaser.GameObjects.Container
{
    constructor(scene, inventory)
    {
        super(scene,800,400);
        this.inventory = inventory;
        this.add(new Phaser.GameObjects.Image(scene,0,0,'inventory'));
        this.add(new InventoryDescription(scene,0,0));
        for (let i = 0; i < this.inventory.length; i++) {
            this.add(new InventoryItem(scene,-460 + 55 *i, -110,this.inventory[i]));
        }
        scene.add.existing(this);
    }
}