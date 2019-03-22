//Tetris created by Mateus Soares

var Tetris = function(params){
	
	this.config = params;
	this.visual = new TetrisVisual(params.container);
	this.tetrisBlocks = [];

	this.build();
	this.beginPieceCicle();
	
};

Tetris.prototype.build = function(){

	var rows = [];

	for(var rows_counter = 0;rows_counter < 16; rows_counter++){

		var row = [];

		for(var columns_counter = 0;columns_counter < 10; columns_counter++){
			row.push(rows_counter === 5 ? {color: "black"} : null);
		}

		rows.push(row);
	}
	
	this.tetrisBlocks = rows;

	this.visual.build();

}

Tetris.prototype.beginPieceCicle = function(){

	var arrayShape = this.createArrayShape();
	
	var shapePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.run(arrayShape, shapePosition)
}

Tetris.prototype.run = function(arrayShape, shapePosition){
	
	var self = this;

	setTimeout(function(){ 
		
		self.clearTemporary();

		if(!(self.detectCollusion(arrayShape, shapePosition))){
	
			self.updateElementPosition(arrayShape, shapePosition);

			shapePosition.bottomPosition++;
			
			console.log(self.tetrisBlocks);
			
			self.run(arrayShape, shapePosition);
		}
		
		self.visual.update(self.tetrisBlocks);
		
	}, 1000);

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

Tetris.prototype.detectCollusion = function(arrayShape, shapePosition){

	var isColliding = false;

	var intendedShapePosition = JSON.parse(JSON.stringify(shapePosition));
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

				isColliding = this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] !== null && arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null;

			}else if(tretisBlocksRowIndex === 16){
				isColliding = true;
			}

		}

	}

	return isColliding;

}

Tetris.prototype.updateElementPosition = function(arrayShape, shapePosition){

	var intendedShapePosition = JSON.parse(JSON.stringify(shapePosition));
	intendedShapePosition.bottomPosition++;

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;
			
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined" && arrayShape[shapeRowsCounter][shapeColumnsCounter] !== null){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = arrayShape[shapeRowsCounter][shapeColumnsCounter];
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex].isTemporary = intendedShapePosition.bottomPosition !== 15;
			}

		}

	}

}

Tetris.prototype.createArrayShape = function(){
	
	//A basic array shape
	var arrayShape = [
		[null, {color: "black"}, null],
		[{color: "black"}, {color: "black"}, {color: "black"}]
	];

	return arrayShape;
}