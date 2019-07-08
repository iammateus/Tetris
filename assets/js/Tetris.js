/*
 *  Tetris created by Mateus Soares <https://github.com/mateussoares1997>
 */

var Tetris = function(params){

	this.gameData ={
		points: 0,
		stage: 1
	}

	this.config = params;
	this.config.speed = this.config.normalSpeed;
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
				self.rotatePiece();
			break;
			case "ArrowLeft":
				self.movePieceTo("left");
			break;
			case "ArrowRight":
				self.movePieceTo("right");
			break;
			case "ArrowDown":
				self.changeSpeed(self.config.normalSpeed/8);
			break;
			default:
				//console.log(event.code);
			break;
		}
	
	});
	
	window.addEventListener("keyup", function(event){

		switch (event.code) {
			case "ArrowDown":
				self.changeSpeed(self.config.normalSpeed);
			break;
			default:
				//console.log(event.code);
			break;
		}
	
	});

}	

Tetris.prototype.startPieceCircle = function(){

	//Return game speed to normal (for a better gameplay)
	this.changeSpeed(this.config.normalSpeed);

	//Cleaning previous piece left position to prevent some bugs
	this.leftPositionBeforeRotation = null ;
	
	//Create a new random piece
	this.pieceShape = this.createPieceArray();
	
	//Setting the initial position
	this.piecePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.visual.updatePointsDisplay(this.gameData.points);
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
			
			//If piece position was updated successfully, tries update again by calling itself
			self.runCircle();

		}else{

			//If collision was detected stores current shape position and finis
			self.fastenPiecePosition();

			self.checkForGamePoints();
			
			//Also starts a new shape circle
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

Tetris.prototype.fastenPiecePosition = function(){

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

	var pieceColor = this.visual.createRandomColor();

	var arrayShapesArray = [
		[
			[{color: pieceColor}, {color: pieceColor}, {color: pieceColor}],
			[null, {color: pieceColor}, null]
		],
		[
			[{color: pieceColor}, {color: pieceColor}, {color: pieceColor}],
			[null, null, {color: pieceColor}]
		],
		[
			[{color: pieceColor}, {color: pieceColor}, {color: pieceColor}],
			[null, null, {color: pieceColor}]
		],
		[
			[{color: pieceColor}],
			[{color: pieceColor}],
			[{color: pieceColor}],
			[{color: pieceColor}]
		],
		[
			[{color: pieceColor},{color: pieceColor},{color: pieceColor},{color: pieceColor}]
		]
	]
	
	return arrayShapesArray[Math.floor(Math.random() * 5)];
		
}

Tetris.prototype.rotatePiece = function(){

	var rotatedPiece = [];

	//Rotating piece to the right
	for(columnCounter = 0;columnCounter < this.pieceShape[0].length; columnCounter++){

		var row = [];

		for(rowCounter = (this.pieceShape.length -1);rowCounter > -1; rowCounter--){

			row.push(this.pieceShape[rowCounter][columnCounter]);
	
		}

		rotatedPiece.push(row);

	}

	var piecePositionCopy = JSON.parse(JSON.stringify(this.piecePosition));
	
	var pieceSizes = {
		rows: rotatedPiece.length,
		columns: rotatedPiece[0].length
	}

	//If the left position was changed by rotating the piece returns it to the left position before rotation
	if(this.leftPositionBeforeRotation !== null && typeof this.leftPositionBeforeRotation !== "undefined"){

		var aux = piecePositionCopy.leftPosition;

		piecePositionCopy.leftPosition = this.leftPositionBeforeRotation;

		if(this.detectCollision(0, piecePositionCopy, rotatedPiece)){
			piecePositionCopy.leftPosition = aux;
		}

		this.leftPositionBeforeRotation = null;

	}

	//Centers the piece when rotating
	if(rotatedPiece[0].length < this.pieceShape[0].length){

		piecePositionCopy.leftPosition++;

		if(!this.detectCollision(0, piecePositionCopy, rotatedPiece)){
			this.leftPositionBeforeRotation = piecePositionCopy.leftPosition - 1;
		}else{
			piecePositionCopy.leftPosition--;
		}

	}

	var success = false;

	for(var countColumns = 0; countColumns < (pieceSizes.columns + 1); countColumns++){
		
		if(!this.detectCollision(0, piecePositionCopy, rotatedPiece) && !success){

			this.clearTemporaryBlocks();
			this.pieceShape = rotatedPiece;

			this.piecePosition = JSON.parse(JSON.stringify(piecePositionCopy));
			this.updatePiecePosition();

			this.visual.update(this.tetrisBlocks);
			success = true;
			
		}else{
			piecePositionCopy.leftPosition--;
		}

	}

}

Tetris.prototype.movePieceTo = function(direction){
	
	var movedPiecePosition = JSON.parse(JSON.stringify(this.piecePosition));
	var positionChanged = false;
	
	if(direction === "left"){	
		
		if(this.piecePosition.leftPosition > 0){
			movedPiecePosition.leftPosition--;
			positionChanged = true;
		}
		
	}else if(direction === "right"){
		
		if(this.piecePosition.leftPosition < (10 - this.pieceShape[0].length)){
			movedPiecePosition.leftPosition++;
			positionChanged = true;
		}
		
	}
	
	if(positionChanged && !(this.detectCollision(0, movedPiecePosition))){
		//Cleaning previous piece left position to prevent some bugs
		this.leftPositionBeforeRotation = null ;
		this.piecePosition = movedPiecePosition;
		this.clearTemporaryBlocks();
		this.updatePiecePosition();
		this.visual.update(this.tetrisBlocks);
	}
	
}

Tetris.prototype.checkForGamePoints = function(){

	for(var rowCounter = 15; rowCounter > 0; rowCounter--){

		//if row is complete:
		if(this.tetrisBlocks[rowCounter].indexOf(null) === -1){

			this.gameData.points += this.gameData.stage * 100;
			
			for(var rowCounterTwo = rowCounter;  rowCounterTwo > 0; rowCounterTwo--){
				this.tetrisBlocks[rowCounterTwo] = JSON.parse(JSON.stringify(this.tetrisBlocks[rowCounterTwo-1]));
			}

			rowCounter++;

		}

	}

}

Tetris.prototype.changeSpeed = function(speed){

	this.config.speed = speed;
	
}