
var TetrisMenu = function(params, tetris)
{
    this.params = params;
    this.tetris = tetris;
    this.menuLayer = document.getElementById(params.menuLayer);
    this.menu = document.getElementById(params.menu);
    this.menuMessage = document.getElementById(params.menuMessage);
    this.buildMenu();
    this.buildPause();
};

TetrisMenu.prototype.buildMenu = function()
{
    this.menu.innerHTML = "";

    var menuItems = this.getMenuItemsByStatus(this.tetris.status);

    for (var menuItemCounter = 0; menuItemCounter < menuItems.length; menuItemCounter++ ) {
        var itemName = menuItems[menuItemCounter];
        var item = document.createElement('li');
        item.innerHTML = itemName;

        item.addEventListener('click', this.executeItemAction.bind(this, itemName));

        this.menu.appendChild(item);
    }

    this.menuMessage.innerHTML = this.getMenuMessageByStatus(this.tetris.status);
}

TetrisMenu.prototype.buildPause = function()
{
    var pause = document.getElementById(this.params.pause);
    
    pause.addEventListener('click', this.pause.bind(this));
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

TetrisMenu.prototype.getMenuMessageByStatus = function(status)
{
    var menuItems = {
        'start': 'Welcome to Tetris!',
        'paused': 'Paused',
        'end': 'The game is over'
    }

    return menuItems[status];
}
    
TetrisMenu.prototype.executeItemAction = function(itemName){
    this[itemName]();
};

TetrisMenu.prototype.start = function(event){
    this.tetris.status = 'running';
    this.tetris.startPieceCircle();
    this.closeMenu();
};

TetrisMenu.prototype.pause = function(event){
    this.tetris.status = 'paused';
    this.openMenu();
    this.buildMenu();
};

TetrisMenu.prototype.resume = function(event){
    this.tetris.status = 'running';
    this.closeMenu();
};

TetrisMenu.prototype.restart = function(event){
    this.tetris.die();
    this.params.autostart = true;
    tetris = new Tetris(this.params);
};

TetrisMenu.prototype.end = function(event){
    this.tetris.status = 'end';
    this.openMenu();
    this.buildMenu();
};

TetrisMenu.prototype.openMenu = function(){
    this.menuLayer.classList.remove('hidden');
}

TetrisMenu.prototype.closeMenu = function(event){
    this.menuLayer.classList.add('hidden');
};