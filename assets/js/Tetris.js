/*
 *  Tetris created by Mateus Soares <https://github.com/mateussoares1997>
 */

var Tetris = function(params){

	this.config = params;
	this.visual = new TetrisVisual(params.container);
	
	//The main Tetris array with all blocks  
	this.tetrisBlocks = [];

	//Current piece position object (left, bottom)
	this.piecePosition = {};

	//Current piece object
	this.pieceShape = [];

	this.createBlocks();
	this.visual.build();
	this.createEventsListeners();

	//Start first piece circle
	this.startPieceCircle();

};

//Builds main Tetris array (16 x 10)
Tetris.prototype.createBlocks = function(){

	var rows = [];

	//Creatig 16 rows
	for(var rowsCounter = 0;rowsCounter < 16; rowsCounter++){

		var row = [];

		//Creating 10 columns
		for(var columnsCounter = 0;columnsCounter < 10; columnsCounter++){
			row.push(null);
		}

		rows.push(row);
	}
	
	this.tetrisBlocks = rows;

}

Tetris.prototype.createEventsListeners = function(){

	var self = this;

	window.addEventListener("keydown", function(event){

		switch (event.code) {
			case "Space":
				self.rotateShape();
			break;
			case "ArrowLeft":
				self.moveShapeTo("left");
			break;
			case "ArrowRight":
				self.moveShapeTo("right");
			break;
			default:
				console.log(event.code);
			break;
		}
	
	});

}	

Tetris.prototype.startPieceCircle = function(){

	//Create a new random piece
	this.pieceShape = this.createPieceArray();
	
	//Setting the initial position
	this.piecePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.runCircle();

}

Tetris.prototype.runCircle = function(){

	var self = this;

	setTimeout(function(){ 
		
		self.clearTemporaryBlocks();

		//Checks whether collision will happen in piece drop, if it's not so then the piece will drop and try to drop again
		if(!(self.detectCollision(1))){

			self.piecePosition.bottomPosition++;
	
			self.updatePiecePosition();
			
			console.log("Current tetrisBlocks state", self.tetrisBlocks);
			
			//If shape position was updated successfully, tries update again by calling itself
			self.runCircle();

		}else{

			//If collision was detected stores current shape position and starts a new shape circle
			self.fastenShapePosition();
			self.startPieceCircle();
			
		}
		
		//Updates visual display every circle time
		self.visual.update(self.tetrisBlocks);
		
	}, self.config.speed);

}

Tetris.prototype.detectCollision = function(bottomPositionIncrement, piecePosition, pieceShape){

	var isColliding = 0;
	var piecePositionToTest = piecePosition ? piecePosition : this.piecePosition;
	var pieceShapeToTest = pieceShape ? pieceShape : this.pieceShape;

	var intendedPiecePosition = JSON.parse(JSON.stringify(piecePositionToTest));
	intendedPiecePosition.bottomPosition += bottomPositionIncrement;

	//Calculating intended top position
	intendedPiecePosition.topPosition = intendedPiecePosition.bottomPosition - (pieceShapeToTest.length - 1);

	for(var pieceRowsCounter = 0;pieceRowsCounter < pieceShapeToTest.length; pieceRowsCounter++){

		for(var pieceColumnsCounter = 0;pieceColumnsCounter < pieceShapeToTest[pieceRowsCounter].length; pieceColumnsCounter++){

			var tretisBlocksRowIndex = intendedPiecePosition.topPosition + pieceRowsCounter;
			var tretisBlocksColumnIndex = intendedPiecePosition.leftPosition + pieceColumnsCounter;

			
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined"){
				/* 
					console.log("tretisBlocksRowIndex", tretisBlocksRowIndex);
					console.log("tretisBlocksColumnIndex", tretisBlocksColumnIndex);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex]);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] === null); 
				*/
				if(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] !== null && pieceShapeToTest[pieceRowsCounter][pieceColumnsCounter] !== null && (typeof this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] === "undefined" || !this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary)){
					isColliding++;
				}

			}else if(tretisBlocksRowIndex === 16){
				isColliding++;
			}

		}

	}

	return isColliding > 0;

}

Tetris.prototype.fastenShapePosition = function(){

	var intendedPiecePosition = JSON.parse(JSON.stringify(this.piecePosition));

	//Calculating intended top position
	intendedPiecePosition.topPosition = intendedPiecePosition.bottomPosition - (this.pieceShape.length - 1);

	for(var pieceRowsCounter = 0;pieceRowsCounter < this.pieceShape.length; pieceRowsCounter++){

		for(var pieceColumnsCounter = 0;pieceColumnsCounter < this.pieceShape[pieceRowsCounter].length; pieceColumnsCounter++){

			var tretisBlocksRowIndex = intendedPiecePosition.topPosition + pieceRowsCounter;
			var tretisBlocksColumnIndex = intendedPiecePosition.leftPosition + pieceColumnsCounter;

			if(this.pieceShape[pieceRowsCounter][pieceColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = this.pieceShape[pieceRowsCounter][pieceColumnsCounter];
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary = false
			}

		}

	}

}

Tetris.prototype.clearTemporaryBlocks = function(){
	
	for(var rowsCounter = 0;rowsCounter < this.tetrisBlocks.length; rowsCounter++){

		for(var columnsCounter = 0;columnsCounter < this.tetrisBlocks[rowsCounter].length; columnsCounter++){

			if(this.tetrisBlocks[rowsCounter][columnsCounter] !== null && this.tetrisBlocks[rowsCounter][columnsCounter].isTemporary){
				this.tetrisBlocks[rowsCounter][columnsCounter] = null;
			}

		}

	}

}

Tetris.prototype.updatePiecePosition = function(){

	var intendedPiecePosition = JSON.parse(JSON.stringify(this.piecePosition));
	
	//Calculating intended top position
	intendedPiecePosition.topPosition = intendedPiecePosition.bottomPosition - (this.pieceShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < this.pieceShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < this.pieceShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedPiecePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedPiecePosition.leftPosition + shapeColumnsCounter;
			
			//Updates current shape position in main array 
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined" && this.pieceShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = this.pieceShape[shapeRowsCounter][shapeColumnsCounter];
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary = true;
			}

		}

	}

}

Tetris.prototype.createPieceArray = function(){

	var arrayShapesArray = [
		[
			[{color: "black"}, {color: "black"}, {color: "black"}],
			[null, {color: "black"}, null]
		],
		[
			[{color: "black"}, {color: "black"}, {color: "black"}],
			[null, null, {color: "black"}]
		],
		[
			[{color: "black"}, {color: "black"}],
			[{color: "black"}, {color: "black"}]
		],
		[
			[{color: "black"}],
			[{color: "black"}],
			[{color: "black"}],
			[{color: "black"}]
		],
		[
			[{color: "black"}]
		]
	]
	
	return arrayShapesArray[Math.floor(Math.random() * 5)];
		
}

Tetris.prototype.rotateShape = function(){
	
	var rotatedShape = [];

	for(columnCounter = 0;columnCounter < this.pieceShape[0].length; columnCounter++){

		var row = [];

		for(rowCounter = (this.pieceShape.length -1);rowCounter > -1; rowCounter--){

			row.push(this.pieceShape[rowCounter][columnCounter]);
	
		}

		rotatedShape.push(row);

	}

	if(!this.detectCollision(0, null, rotatedShape)){
		this.clearTemporaryBlocks();
		this.pieceShape = rotatedShape;
		this.updatePiecePosition();
		this.visual.update(this.tetrisBlocks);
	}

}

Tetris.prototype.moveShapeTo = function(direction){

	var movedShapePosition = JSON.parse(JSON.stringify(this.piecePosition));
	var positionChanged = false;

	if(direction === "left"){	
		
		if(this.piecePosition.leftPosition > 0){
			movedShapePosition.leftPosition--;
			positionChanged = true;
		}

	}else if(direction === "right"){
		
		if(this.piecePosition.leftPosition < (10 - this.pieceShape[0].length)){
			movedShapePosition.leftPosition++;
			positionChanged = true;
		}
		
	}

	if(positionChanged && !(this.detectCollision(0, movedShapePosition))){
		this.piecePosition = movedShapePosition;
		this.clearTemporaryBlocks();
		this.updatePiecePosition();
		this.visual.update(this.tetrisBlocks);
	}
	

}