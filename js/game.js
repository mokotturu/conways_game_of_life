const $map = $('#map');
const width = 10;
const rows = $map.height() / width;
const columns = $map.width() / width;
var grid = [], tempGrid = { revive: [], kill: [] };
var count = 0, waitCount = 0;
$.jCanvas.defaults.fromCenter = false;

$(document).ready(() => {
	for (let i = 0; i < columns; ++i) {
		grid.push([]);
		for (let j = 0; j < rows; ++j) {
			grid[i].push({ isAlive: Math.floor(Math.random() * 2) });
		}
	}
	
	// unfinished glider gun
	/* grid[7][1].isAlive = true;
	grid[8][1].isAlive = true;
	grid[7][2].isAlive = true;
	grid[8][2].isAlive = true;

	grid[5][13].isAlive = true;
	grid[4][12].isAlive = true;
	grid[5][11].isAlive = true;
	grid[6][10].isAlive = true;
	grid[7][10].isAlive = true;
	grid[8][10].isAlive = true;
	grid[9][11].isAlive = true;
	grid[10][12].isAlive = true;
	grid[9][13].isAlive = true;
	grid[6][14].isAlive = true;
	grid[7][14].isAlive = true;
	grid[8][14].isAlive = true;
	grid[6][15].isAlive = true;
	grid[7][15].isAlive = true;
	grid[8][15].isAlive = true;

	grid[6][21].isAlive = true;
	grid[5][21].isAlive = true;
	grid[4][21].isAlive = true;
	grid[7][22].isAlive = true;
	grid[6][22].isAlive = true;
	grid[4][22].isAlive = true;
	grid[3][22].isAlive = true;
	grid[7][23].isAlive = true;
	grid[6][23].isAlive = true;
	grid[4][23].isAlive = true;
	grid[3][23].isAlive = true;
	grid[7][24].isAlive = true;
	grid[6][24].isAlive = true;
	grid[5][24].isAlive = true;
	grid[4][24].isAlive = true;
	grid[3][24].isAlive = true;
	grid[2][25].isAlive = true;
	grid[3][25].isAlive = true;
	grid[7][25].isAlive = true;
	grid[8][25].isAlive = true;

	grid[3][30].isAlive = true;
	grid[4][30].isAlive = true;

	grid[5][34].isAlive = true;
	grid[6][34].isAlive = true;
	grid[5][35].isAlive = true;
	grid[6][35].isAlive = true; */

	refreshMap();
	requestAnimationFrame(loop);
});

function loop() {
	if (++count < waitCount) {
		return;
	}
	count = 0;

	grid.forEach((col, i) => {
		col.forEach((row, j) => {
			let neighbours = [{ x: j, y: i - 1 },
							{ x: j + 1, y: i - 1 },
							{ x: j + 1, y: i },
							{ x: j + 1, y: i + 1 },
							{ x: j, y: i + 1 },
							{ x: j - 1, y: i + 1 },
							{ x: j - 1, y: i },
							{ x: j - 1, y: i - 1}];
			let surroundingLives = 0;
			for (let x = 0; x < neighbours.length; ++x) {
				if (neighbours[x].x > -1 && neighbours[x].x < columns && neighbours[x].y > -1 && neighbours[x].y < columns && grid[neighbours[x].x][neighbours[x].y].isAlive) ++surroundingLives;
			}

			if (grid[j][i].isAlive) {
				if (surroundingLives < 2 || surroundingLives >= 4) tempGrid.kill.push({ x: j, y: i });
			} else {
				if (surroundingLives == 3) tempGrid.revive.push({ x: j, y: i });
			}
		});
	});

	tempGrid.revive.forEach(cell => { grid[cell.x][cell.y].isAlive = true; });
	tempGrid.kill.forEach(cell => { grid[cell.x][cell.y].isAlive = false; });
	tempGrid.revive = [];
	tempGrid.kill = [];

	refreshMap();
	requestAnimationFrame(loop);
}

function refreshMap() {
	for (let col = 0; col < grid.length; ++col) {
		for (let row = 0; row < grid[col].length; ++row) {
			$map.drawRect({
				fillStyle: (grid[row][col].isAlive) ? '#FFFFFF' : '#000000',
				x: col * width, y: row * width,
				width: width - 1, height: width - 1
			});
		}
	}
}
