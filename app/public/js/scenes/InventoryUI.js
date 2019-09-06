class InventoryUI extends Phaser.GameObjects.Container
{
    constructor(scene, inventory)
    {
        super(scene,800,400);
        this.inventory = inventory;
        this.add(new Phaser.GameObjects.Image(scene,0,0,'inventory'));
        this.inventoryDescription = new InventoryDescription(scene, 0, 0);
        this.itemsContainer = new Phaser.GameObjects.Container(scene, -520, -150);
        this.add(this.inventoryDescription);
        this.add(this.itemsContainer);
        this.displayInventory();
        scene.add.existing(this);
    }

    updateInventory(inventory)
    {
        this.inventory = inventory;
        this.itemsContainer.removeAll(true);
        this.displayInventory();
    }

    displayInventory()
    {
        console.log(this.inventory);
        
        for (let i = 0; i < this.inventory.length; i++) 
        {
            this.itemsContainer.add(new InventoryItem(this.scene,55 *i, 0,this.inventory[i]));
        }
    }
}