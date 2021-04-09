$.jCanvas.defaults.fromCenter = false;
const $map = $('#map');
const width = 10;
const rows = $map.height() / width;
const columns = $map.width() / width;
var grid, tempGrid = { revive: [], kill: [] };
var count = 0, waitCount = 0;
var paused = true;
const gospelGliderGun = [{x: 5, y: 2},{x: 5, y: 1},{x: 6, y: 1},{x: 6, y: 2},{x: 5, y: 11},{x: 6, y: 11},{x: 7, y: 11},{x: 4, y: 12},{x: 8, y: 12},{x: 3, y: 13},{x: 9, y: 13},{x: 3, y: 14},{x: 9, y: 14},{x: 6, y: 15},{x: 4, y: 16},{x: 8, y: 16},{x: 5, y: 17},{x: 6, y: 17},{x: 7, y: 17},{x: 6, y: 18},{x: 3, y: 21},{x: 4, y: 21},{x: 5, y: 21},{x: 3, y: 22},{x: 4, y: 22},{x: 5, y: 22},{x: 2, y: 23},{x: 6, y: 23},{x: 1, y: 25},{x: 2, y: 25},{x: 6, y: 25},{x: 7, y: 25},{x: 3, y: 35},{x: 4, y: 35},{x: 3, y: 36},{x: 4, y: 36}];

$(document).ready(() => {
	createGrid();
	refreshMap();
	// requestAnimationFrame(loop);
});

function createGrid() {
	grid = [];
	for (let i = 0; i < columns; ++i) {
		grid.push([]);
		for (let j = 0; j < rows; ++j) {
			grid[i].push({ isAlive: false });
		}
	}
}

function loop() {
	if (!paused) {
		if (++count < waitCount) return;
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
}

function refreshMap() {
	for (let col = 0; col < grid.length; ++col) {
		for (let row = 0; row < grid[col].length; ++row) {
			$map.drawRect({
				fillStyle: (grid[row][col].isAlive) ? '#FFFFFF' : '#303030',
				x: col * width, y: row * width,
				width: width - 1, height: width - 1
			});
		}
	}
}

function toggleLife(e) {
	let rect = $map[0].getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	let cellX = Math.floor(x / width);
	let cellY = Math.floor(y / width);

	grid[cellY][cellX].isAlive = !grid[cellY][cellX].isAlive;
	refreshMap();
}

function play() {
	if (paused) {
		requestAnimationFrame(loop);
		paused = false;
	}
}

function pause() {
	if (!paused) {
		cancelAnimationFrame(loop);
		paused = true;
	}
}

function clearScreen() {
	pause();
	createGrid();
	refreshMap();
}

function spawnObject(myObj) {
	clearScreen();

	myObj.forEach((data, i) => {
		grid[data.x][data.y].isAlive = true;
	});

	refreshMap();
}

$map.on("click", e => {
	toggleLife(e);
});
