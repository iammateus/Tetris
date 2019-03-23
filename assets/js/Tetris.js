//Tetris created by Mateus Soares

var Tetris = function(params){
	
	this.config = params;
	this.visual = new TetrisVisual(params.container);
	this.tetrisBlocks = [];
	this.shapePosition = {};

	this.build();
	this.visual.build();
	this.beginPieceCicle();

};

Tetris.prototype.build = function(){

	var rows = [];

	for(var rows_counter = 0;rows_counter < 16; rows_counter++){

		var row = [];

		for(var columns_counter = 0;columns_counter < 10; columns_counter++){
			//row.push(rows_counter === 5 ? {color: "black"} : null);
			row.push(null);
		}

		rows.push(row);
	}
	
	this.tetrisBlocks = rows;

}

Tetris.prototype.beginPieceCicle = function(){

	var arrayShape = this.createArrayShape();
	
	this.shapePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	this.run(arrayShape)
}

Tetris.prototype.run = function(arrayShape){
	
	var self = this;

	setTimeout(function(){ 
		
		self.clearTemporary();

		if(!(self.detectCollision(arrayShape))){
	
			self.updateElementPosition(arrayShape);

			self.shapePosition.bottomPosition++;
			
			console.log(self.tetrisBlocks);
			
			self.run(arrayShape);
		}else{
			self.beginPieceCicle();
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

Tetris.prototype.updateElementPosition = function(arrayShape){

	var intendedShapePosition = JSON.parse(JSON.stringify(this.shapePosition));
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

	var arrayShapesArray = [
		[
			[{color: "black"}, {color: "black"}, {color: "black"}],
			[null, {color: "black"}, null]
		],
		[
			[{color: "black"}, {color: "black"}, {color: "black"}],
			[null, null, {color: "black"}]
		]
	]
	
	return arrayShapesArray[Math.floor(Math.random() * 2)];
		
}