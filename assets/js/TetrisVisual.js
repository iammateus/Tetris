
var TetrisVisual = function(container, nextPiecesListContainer, pointsDisplay){
    this.container = document.getElementById(container);
    this.nextPiecesListContainer = document.getElementById(nextPiecesListContainer);
	this.pointsDisplay = document.getElementById(pointsDisplay);;
	this.createdVisualBlocks = [];
};

TetrisVisual.prototype.build = function(){
	this.buildTetrisElement();
}

TetrisVisual.prototype.buildTetrisElement = function(){
	
	var rows = [];
	
	for(var rows_counter = 0;rows_counter < 16; rows_counter++){
		
		var row = [];
		
		for(var columns_counter = 0;columns_counter < 10; columns_counter++){
			
			var newBlock = document.createElement("div");
			newBlock.classList.add("block");
			row.push(newBlock);
			this.container.appendChild(newBlock);
			
		}
		
		rows.push(row);
		
	}
	
	this.createdVisualBlocks = rows;
	
}

TetrisVisual.prototype.updatePointsDisplay = function(points){
	this.pointsDisplay.innerHTML = "Points: " + points;
}

TetrisVisual.prototype.update = function(tetrisBlocks){
	
	var tetrisBlocksCopy = JSON.parse(JSON.stringify(tetrisBlocks));
	
	for(var rows_counter = 0;rows_counter < tetrisBlocksCopy.length; rows_counter++){

		for(var columns_counter = 0;columns_counter < tetrisBlocksCopy[rows_counter].length; columns_counter++){
			
			if(tetrisBlocksCopy[rows_counter][columns_counter] !== null){
				var block = tetrisBlocksCopy[rows_counter][columns_counter];
				this.createdVisualBlocks[rows_counter][columns_counter].style.backgroundColor = block.color;
			}else{
				this.createdVisualBlocks[rows_counter][columns_counter].style.backgroundColor = "";
			}
			
		}
		
	}
	
}

TetrisVisual.prototype.createRandomColor = function(){
	return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
}

TetrisVisual.prototype.updateNextPiecesListContainer = function(piecesList){
    
    var piecesListSize = piecesList.length;
    
    this.nextPiecesListContainer.innerHTML = "";

    for (var piecesCounter = 1; piecesCounter < piecesListSize; piecesCounter++) {
        
        var piece = piecesList[piecesCounter];

        var singlePieceContainer = document.createElement("div");
        singlePieceContainer.classList.add("single-piece-container");
        singlePieceContainer.style.width = (piece[0].length * 20) + "px";

        for (var pieceRowCounter = 0; pieceRowCounter < piece.length; pieceRowCounter++) {
            
            for (var pieceColumnsCounter = 0; pieceColumnsCounter < piece[pieceRowCounter].length; pieceColumnsCounter++) {
                
                var newBlock = document.createElement("div");
                newBlock.classList.add("block");

                var pieceColor = "white";

                if(piece[pieceRowCounter][pieceColumnsCounter]){
                    pieceColor = piece[pieceRowCounter][pieceColumnsCounter].color;
                }

                newBlock.style.backgroundColor = pieceColor;
                singlePieceContainer.appendChild(newBlock);
                
            }
         
        }

        this.nextPiecesListContainer.appendChild(singlePieceContainer);
        
    }

}