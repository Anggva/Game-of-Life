var pixelSize;
var generation = 0;
var numCells = 0;
var numInfected = 0;
var n;
var m;
var canvas;
var probAlive = document.getElementById('probAlive').value;
var probInfected = document.getElementById('probInfected').value;
var stepInfected = document.getElementById('stepInfected').value;
var globGrid = buildArray();
var context;
var refreshIntervalId;

//Building array for our grid  (filling it with zeros)
function buildArray() {
        var grid = [];
        for(var i = 0; i<n; i++) {
                var innerGrid = [];
                for(var j = 0; j<m; j++) {
                        innerGrid[j] = 0;
                }
                grid[i] = innerGrid;
        }
        return grid;
}

function display(grid) {
	context = canvas.getContext('2d');    
	for(var i = 0; i < grid.length; i++) {
                for(var j = 0; j < grid[i].length; j++) {
                        drawCell(i,j,grid[i][j]);
                }
        }
}
//Displaying a cell on the screen
function drawCell(x,y,state) {    
	context.beginPath();
    context.rect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
    var style;
    if (state == 0)
        style='white';
    else if (state == 1)
        style = 'black';
    else style = 'red';
    context.fillStyle = style;
    context.fill();
}
//Randomly populate the grid
function randomlyPopulate(grid, probAlive, probInfected) {
        for(var i = 0; i < grid.length; i++) {
                for(var j = 0; j < grid[i].length; j++) {
                	var r = Math.random();
                	if ((r < probAlive + probInfected)&&(r > probInfected)){
                       	grid[i][j]=1;
                       	numCells++;
                    }
                    else grid[i][j]=0;
                }
                        
        }
}

function addInfected(grid, probInfected){
	for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
        	var r = Math.random();
                if(grid[i][j] == 1&&r < probInfected) {
                        grid[i][j]=-1;
                        numInfected++;
                }
        }
                
}
}

//figuring out the nature of the neighbors (all the neighbors, including diagonals)
function neighborsAlive(grid, x, y) {
	var alive = 0;
	if (x == 0 && y == 0){
		if (grid[x+1][y+1]==1)
        	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        return alive;
	}
	if (x == 0 && y > 0 && y < m-1){
		if (grid[x+1][y+1]==1)
        	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x+1][y-1]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
	if (x > 0 && y == 0 && x < n-1){
		if (grid[x+1][y+1]==1)
        	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        if (grid[x-1][y+1]==1)
        	alive++;
        return alive;
	}
	if (y == 0 && x == n-1){
		if (grid[x][y+1]==1)
        	alive++;
        if (grid[x-1][y+1]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        return alive;
	}
	if (y == m-1 && x == 0){
		if (grid[x][y-1]==1)
        	alive++;
        if (grid[x+1][y-1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        return alive;
	}
	if (y == m-1 && x == n-1){
		if (grid[x-1][y-1]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        return alive;
	}
	
	if (y < m-1 && y > 0 && x == n-1){
		if (grid[x-1][y+1]==1)
        	alive++;
        if (grid[x-1][y-1]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
	if (x < n-1 && x > 0 && y == m-1){
		if (grid[x-1][y]==1)
        	alive++;
        if (grid[x-1][y-1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x+1][y-1]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
    if(x > 0 && y > 0 && x < n-1 && y < m-1) {
        if (grid[x-1][y-1]==1)
            	alive++;
        if (grid[x][y-1]==1)
            	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y-1]==1)
            	alive++;
        if (grid[x-1][y]==1)
            	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x-1][y+1]==1)
            	alive++;
        if (grid[x+1][y+1]==1)
            	alive++;
            return alive;
        } else {
                return 0;
        }
}
function neighborsInfected(grid, x, y) {
	var infected = 0;
	if (x == 0 && y == 0){
		if (grid[x+1][y+1]==-1)
        	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        return infected;
	}
	if (x == 0 && y > 0 && y < m-1){
		if (grid[x+1][y+1]==-1)
        	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x+1][y-1]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
	if (x > 0 && y == 0 && x < n-1){
		if (grid[x+1][y+1]==-1)
        	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        if (grid[x-1][y+1]==-1)
        	infected++;
        return infected;
	}
	if (y == 0 && x == n-1){
		if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x-1][y+1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        return infected;
	}
	if (y == m-1 && x == 0){
		if (grid[x][y-1]==-1)
        	infected++;
        if (grid[x+1][y-1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        return infected;
	}
	if (y == m-1 && x == n-1){
		if (grid[x-1][y-1]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        return infected;
	}
	
	if (y < m-1 && y > 0 && x == n-1){
		if (grid[x-1][y+1]==-1)
        	infected++;
        if (grid[x-1][y-1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
	if (x < n-1 && x > 0 && y == m-1){
		if (grid[x-1][y]==-1)
        	infected++;
        if (grid[x-1][y-1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x+1][y-1]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
    if(x > 0 && y > 0 && x < n-1 && y < m-1) {
        if (grid[x-1][y-1]==-1)
            	infected++;
        if (grid[x][y-1]==-1)
            	infected++;
        if (grid[x+1][y-1]==-1)
            	infected++;
        if (grid[x-1][y]==-1)
            	infected++;
        if (grid[x-1][y+1]==-1)
            	infected++;
        if (grid[x+1][y+1]==-1)
            	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
            return infected;
        } else {
                return 0;
        }
}
//figuring out the nature of the neighbors (Neighbors on NSEW)
function neighborsAliveNE(grid, x, y) {
	var alive = 0;
	if (x == 0 && y == 0){
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        return alive;
	}
	if (x == 0 && y > 0 && y < m-1){
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
	if (x > 0 && y == 0 && x < n-1){
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        return alive;
	}
	if (y == 0 && x == n-1){
		if (grid[x][y+1]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        return alive;
	}
	if (y == m-1 && x == 0){
		if (grid[x][y-1]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        return alive;
	}
	if (y == m-1 && x == n-1){
        if (grid[x][y-1]==1)
        	alive++;
        if (grid[x-1][y]==1)
        	alive++;
        return alive;
	}
	
	if (y < m-1 && y > 0 && x == n-1){
        if (grid[x-1][y]==1)
        	alive++;
        if (grid[x][y+1]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
	if (x < n-1 && x > 0 && y == m-1){
		if (grid[x-1][y]==1)
        	alive++;
        if (grid[x+1][y]==1)
        	alive++;
        if (grid[x][y-1]==1)
        	alive++;
        return alive;
	}
    if(x > 0 && y > 0 && x < n-1 && y < m-1) {
        if (grid[x][y+1]==1)
            	alive++;
        if (grid[x][y-1]==1)
            	alive++;
        if (grid[x+1][y]==1)
            	alive++;
        if (grid[x-1][y]==1)
            	alive++;
            return alive;
        } else {
                return 0;
        }
}
function neighborsInfectedNE(grid, x, y) {
	var infected = 0;
	if (x == 0 && y == 0){
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        return infected;
	}
	if (x == 0 && y > 0 && y < m-1){
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
	if (x > 0 && y == 0 && x < n-1){
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        return infected;
	}
	if (y == 0 && x == n-1){
		if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        return infected;
	}
	if (y == m-1 && x == 0){
		if (grid[x][y-1]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        return infected;
	}
	if (y == m-1 && x == n-1){
        if (grid[x][y-1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
        	infected++;
        return infected;
	}
	
	if (y < m-1 && y > 0 && x == n-1){
        if (grid[x-1][y]==-1)
        	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
	if (x < n-1 && x > 0 && y == m-1){
		if (grid[x-1][y]==-1)
        	infected++;
        if (grid[x+1][y]==-1)
        	infected++;
        if (grid[x][y-1]==-1)
        	infected++;
        return infected;
	}
    if(x > 0 && y > 0 && x < n-1 && y < m-1) {
        if (grid[x][y-1]==-1)
            	infected++;
        if (grid[x][y+1]==-1)
        	infected++;
        if (grid[x-1][y]==-1)
            	infected++;
        if (grid[x+1][y]==-1)
            	infected++;
            return infected;
        } else {
                return 0;
        }
}
function countCells(arr){
	numCells = 0;
	for(var x = 0; x < arr.length; x++) {
        for(var y = 0; y < arr[x].length; y++) {
                if (arr[x][y] == 1)
                	numCells++;
        }
	}
}

function step(arr) {
        var newArr = buildArray();
        for(var x = 0; x < arr.length; x++) {
                for(var y = 0; y < arr[x].length; y++) {
                        var cell = arr[x][y];
                        var alives = neighborsAlive(arr, x,y);
                        var infecteds = neighborsInfected(arr,x,y);

                        if(cell == 1) {
                        	if (infecteds > 0){
                            	newArr[x][y] = -1;
                            	numCells--;
                            	numInfected++;
                            }    
                        	else if(alives < 2) {
                                newArr[x][y] = 0;
                                numCells--;
                            } else if(alives == 2 || alives == 3) {
                                newArr[x][y] = 1;
                            } else if(alives > 3) {
                                newArr[x][y] = 0;
                                numCells--;
                            }
                                
                        } else if(cell == 0 && alives == 3) {
                                newArr[x][y] = 1;
                                numCells++;
                        }
                        else if (cell == -1){
                        	newArr[x][y] = 0;
                        	numInfected--;
                        }
                }
        }
        return newArr;
}
function generate(){
	canvas = document.getElementById('background');
	n = document.getElementById('width').value; //width in cells
	m= document.getElementById('height').value;//height in cells
	pixelSize = 5;
	canvas.width = pixelSize*n;
	canvas.height = pixelSize*m;
	var grid = buildArray();
	probAlive = document.getElementById('probAlive').value/100;
	probInfected = document.getElementById('probInfected').value/100;
	stepInfected = document.getElementById('stepInfected').value;
	numCells = 0;
	randomlyPopulate(grid,probAlive,probInfected);
	display(grid);
	var x=document.getElementById("livecells");
	x.innerHTML=numCells;
	globGrid = grid;
	generation = 0;
}

function run(){
	var grid = globGrid;
	probInfected = document.getElementById('probInfected').value/100;
	stepInfected = document.getElementById('stepInfected').value;
	refreshIntervalId = setInterval(function() {
		generation++;
		var x=document.getElementById("generation");
		x.innerHTML=generation.toString();
		if (generation == stepInfected){
			numInfected = 0;
			addInfected(grid, probInfected);
			display(grid);
			x=document.getElementById("infectedcells");
			x.innerHTML=numInfected.toString();
		}
		grid = step(grid);
		display(grid);
		x=document.getElementById("infectedcells");
		x.innerHTML=numInfected.toString();
		x=document.getElementById("livecells");
		x.innerHTML=numCells.toString();
		globGrid = grid;
		countCells(globGrid);
		if (numCells <= 0 && numInfected <= 0)
			clearInterval(refreshIntervalId);
}, 100);
}
	
function stop(){
	clearInterval(refreshIntervalId);
}

function stepNext(){
	generation++;
	var grid = globGrid;
	if (generation == stepInfected){
		numInfected = 0;
		addInfected(grid, probInfected);
		display(grid);
		x=document.getElementById("infectedcells");
		x.innerHTML=numInfected.toString();
	}
	grid = step(grid);
	display(grid);
	globGrid = grid;
	var x=document.getElementById("generation");
	x.innerHTML=generation.toString();
	countCells(globGrid);
	if (numCells <= 0 && numInfected <= 0)
		clearInterval(refreshIntervalId);
}

function clearGrid(){
	clearInterval(refreshIntervalId);
	var grid = buildArray();
		display(grid);
	var x=document.getElementById("livecells");
	numCells = 0;
	generation = 0;
	x.innerHTML=numCells.toString();
	x=document.getElementById("generation");
	x.innerHTML=generation.toString();
	globGrid = grid;
}