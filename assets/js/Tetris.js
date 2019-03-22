//Tetris created by Mateus Soares

var Tetris = function(params){
	
	this.config = params;
	this.visual = new TetrisVisual(params.container);
	this.tetrisBlocks = [];

	this.build();
	this.run();
	
};

Tetris.prototype.build = function(){

	var rows = [];

	for(var rows_counter = 0;rows_counter < 16; rows_counter++){

		var row = [];

		for(var columns_counter = 0;columns_counter < 10; columns_counter++){
	
			row.push(null);

		}

		rows.push(row);

	}
	
	this.tetrisBlocks = rows;

	this.visual.build();
}

Tetris.prototype.run = function(){

	var arrayShape = this.createArrayShape();
	
	var shapePosition = {
		leftPosition: 0, 
		bottomPosition: -1,
	}

	while(!(this.detectCollusion(arrayShape, shapePosition))){

		this.dropShapeElement(arrayShape, shapePosition);
		
		shapePosition.bottomPosition++;
		
	}	

}

Tetris.prototype.detectCollusion = function(arrayShape, shapePosition){

	var isColliding = false;

	var intendedShapePosition = JSON.parse(JSON.stringify(shapePosition));
	intendedShapePosition.bottomPosition++;

	//console.log(intendedShapePosition);

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

Tetris.prototype.dropShapeElement = function(arrayShape, shapePosition){

	var intendedShapePosition = JSON.parse(JSON.stringify(shapePosition));
	intendedShapePosition.bottomPosition++;

	//Calculating intended top position
	intendedShapePosition.topPosition = intendedShapePosition.bottomPosition - (arrayShape.length - 1);

	for(var shapeRowsCounter = 0;shapeRowsCounter < arrayShape.length; shapeRowsCounter++){

		for(var shapeColumnsCounter = 0;shapeColumnsCounter < arrayShape[shapeRowsCounter].length; shapeColumnsCounter++){

			var tretisBlocksRowIndex = intendedShapePosition.topPosition + shapeRowsCounter;
			var tretisBlocksColumnIndex = intendedShapePosition.leftPosition + shapeColumnsCounter;
			
			if(typeof this.tetrisBlocks[tretisBlocksRowIndex] !== "undefined"){
				this.tetrisBlocks[tretisBlocksRowIndex][tretisBlocksColumnIndex] = arrayShape[shapeRowsCounter][shapeColumnsCounter];
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