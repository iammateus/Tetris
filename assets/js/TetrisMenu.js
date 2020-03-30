
var TetrisMenu = function(params, tetris)
{
    this.params = params;
    this.tetris = tetris;
    this.status = 'start';
    this.menuLayer = document.getElementById(params.menuLayer);
    this.menu = document.getElementById(params.menu);
    this.buildMenu();
};

TetrisMenu.prototype.buildMenu = function()
{
    var menuItems = this.getMenuItemsByStatus(this.status);

    for (var menuItemCounter = 0; menuItemCounter < menuItems.length; menuItemCounter++ ) {
        var itemName = menuItems[menuItemCounter];
        var item = document.createElement('li');
        item.innerHTML = itemName;

        item.addEventListener('click', this.executeItemAction.bind(this, itemName));

        this.menu.appendChild(item);
    }
    
}

TetrisMenu.prototype.getMenuItemsByStatus = function(status)
{
    var menuItems = {
        'start': [
            'start',
        ],
        'paused': [
            'resume',
            'restart'
        ],
        'end': [
            'restart'
        ]
    }

    return menuItems[status];
}

TetrisMenu.prototype.executeItemAction = function(itemName){
    this[itemName]();
};

TetrisMenu.prototype.start = function(event){
    this.tetris.startPieceCircle();
    this.closeMenu();
};

TetrisMenu.prototype.closeMenu = function(event){
    this.menuLayer.classList.add('hidden');
};