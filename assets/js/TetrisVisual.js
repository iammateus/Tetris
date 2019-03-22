
var TetrisVisual = function(container){

	this.container = document.getElementById(container);
	this.createdVisualBlocks = [];
};

TetrisVisual.prototype.build = function(){

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
	
	this.createdBlocks = rows;

}