const $map = $('#map');
const width = 10;
const rows = $map.height() / width;
const columns = $map.width() / width;
var grid, tempGrid = { revive: [], kill: [] };
var count = 0, waitCount = 0;
var paused = true;
$.jCanvas.defaults.fromCenter = false;

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

function stop() {
	if (!paused) {
		cancelAnimationFrame(loop);
		paused = true;
	}
}

function clearScreen() {
	stop();
	createGrid();
	refreshMap();
}

$map.on("click", e => {
	toggleLife(e);
});
