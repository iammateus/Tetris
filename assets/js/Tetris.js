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

	this.arrayShape = this.createArrayShape();
	
	this.shapePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.runCircle();

}

Tetris.prototype.runCircle = function(){

	var self = this;

	setTimeout(function(){ 
		
		self.clearTemporary();

		//Checks whether collision will happen in the next block, if it's not so then update to the position of the next block
		if(!(self.detectCollision())){
	
			self.updateShapePosition();
			
			console.log("Current tetrisBlocks state", self.tetrisBlocks);
			
			//If shape position was updated successfully, tries update again by calling itself
			self.runCircle();

		}else{

			//If collision was detected stores current shape position and starts a new shape circle
			self.storeShapePosition();
			self.startPieceCircle();
			
		}
		
		//Updates visual display every circle time
		self.visual.update(self.tetrisBlocks);
		
	}, this.config.speed);

}

Tetris.prototype.storeShapePosition = function(){

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (this.arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < this.arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < this.arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;

			if(this.arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = this.arrayShape[shapeRowsCounter][shapeColumnsCounter];
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

Tetris.prototype.detectCollision = function(){

	var isColliding = 0;

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));
	intendedShapePosition.bottomPosition++;

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (this.arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < this.arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < this.arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;

			
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined"){
				/* 
					console.log("tretisBlocksRowIndex", tretisBlocksRowIndex);
					console.log("tretisBlocksColumnIndex", tretisBlocksColumnIndex);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex]);
					console.log(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] === null); 
				*/
				if(this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] !== null && this.arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
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
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (this.arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < this.arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < this.arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;
			
			//Updates current shape position in main array 
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined" && this.arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = this.arrayShape[shapeRowsCounter][shapeColumnsCounter];
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

Tetris.prototype.rotateShape = function(){
	
	var rotatedShape = [];

	for(columnCounter = 0;columnCounter < this.arrayShape[0].length; columnCounter++){

		var row = [];

		for(rowCounter = (this.arrayShape.length -1);rowCounter > -1; rowCounter--){

			row.push(this.arrayShape[rowCounter][columnCounter]);
	
		}

		rotatedShape.push(row);

	}

	this.arrayShape = rotatedShape;
	
}
