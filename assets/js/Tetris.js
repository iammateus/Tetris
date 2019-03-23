//Tetris created by Mateus Soares <https://github.com/mateussoares1997>

var Tetris = function(params){

	this.config = params;
	this.visual = new TetrisVisual(params.container);
	
	//The main array  
	this.tetrisBlocks = [];
	this.shapePosition = {};

	this.build();
	this.visual.build();

	//Start first piece circle
	this.startPieceCircle();

};

//Builds main array
Tetris.prototype.build = function(){

	var rows = [];

	//Creatig 16 rows
	for(var rows_counter = 0;rows_counter < 16; rows_counter++){

		var row = [];

		//Creating 10 columns
		for(var columns_counter = 0;columns_counter < 10; columns_counter++){
			row.push(null);
		}

		rows.push(row);
	}
	
	this.tetrisBlocks = rows;

}

Tetris.prototype.startPieceCircle = function(){

	var arrayShape = this.createArrayShape();
	
	this.shapePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.runCircle(arrayShape);

}

Tetris.prototype.runCircle = function(arrayShape){

	var self = this;

	setTimeout(function(){ 
		
		self.clearTemporary();

		//Checks whether collision will happen in the next block, if it's not so then update to the position of the next block
		if(!(self.detectCollision(arrayShape))){
	
			self.updateShapePosition(arrayShape);
			
			console.log("Current tetrisBlocks state", self.tetrisBlocks);
			
			//If shape position was updated successfully, tries update again by calling itself
			self.runCircle(arrayShape);

		}else{

			//If collision was detected stores current shape position and starts a new shape circle
			self.storeShapePosition(arrayShape);
			self.startPieceCircle();
			
		}
		
		//Updates visual display every circle time
		self.visual.update(self.tetrisBlocks);
		
	}, this.config.speed);

}

Tetris.prototype.storeShapePosition = function(arrayShape){

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;

			if(arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = arrayShape[shapeRowsCounter][shapeColumnsCounter];
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary = false
			}

		}

	}

}

Tetris.prototype.clearTemporary = function(){
	
	for(var rows_counter = 0;rows_counter < this.tetrisBlocks.length; rows_counter++){

		for(var columns_counter = 0;columns_counter < this.tetrisBlocks[rows_counter].length; columns_counter++){

			if(this.tetrisBlocks[rows_counter][columns_counter] !== null && this.tetrisBlocks[rows_counter][columns_counter].isTemporary){
				this.tetrisBlocks[rows_counter][columns_counter] = null;
			}

		}

	}

}

Tetris.prototype.detectCollision = function(arrayShape){

	var isColliding = 0;

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));
	intendedShapePosition.bottomPosition++;

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;

			
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined"){
				/* 
					console.log("tretisBlocksRowIndex", tretisBlocksRowIndex);
					console.log("tretisBlocksColumnIndex", tretisBlocksColumnIndex);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex]);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] === null); 
				*/
				if(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] !== null && arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
					isColliding++;
				}

			}else if(tretisBlocksRowIndex === 16){
				isColliding++;
			}

		}

	}

	return isColliding > 0;

}

Tetris.prototype.updateShapePosition = function(arrayShape){

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));
	intendedShapePosition.bottomPosition++;
	
	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;
			
			//Updates current shape position in main array 
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined" && arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = arrayShape[shapeRowsCounter][shapeColumnsCounter];
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary = true;
			}

		}

	}

	//Updates current shape bottom position attribute
	this.shapePosition.bottomPosition++;

}

Tetris.prototype.createArrayShape = function(){

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
		]
	]
	
	return arrayShapesArray[Math.floor(Math.random() * 4)];
		
}