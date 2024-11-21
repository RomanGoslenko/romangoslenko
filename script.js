const gridSize = 10; // Размер игрового поля (10x10)
const mineCount = 15; // Количество мин

const container = document.getElementById('game-container');
container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

const cells = [];
let mines = [];

// Создание игрового поля
function createGame() {
    container.innerHTML = '';
    cells.length = 0;
    mines = generateMines();

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => revealCell(i));
        container.appendChild(cell);
        cells.push(cell);
    }
}

// Генерация мин
function generateMines() {
    const positions = new Set();
    while (positions.size < mineCount) {
        positions.add(Math.floor(Math.random() * gridSize * gridSize));
    }
    return [...positions];
}

// Открытие ячейки
function revealCell(index) {
    const cell = cells[index];
    if (cell.classList.contains('revealed')) return;

    cell.classList.add('revealed');
    if (mines.includes(index)) {
        cell.classList.add('mine');
        cell.textContent = 'X'; // Добавляем "X" для мины
        setTimeout(() => {
            alert('Вы проиграли!');
            createGame(); // Перезапуск игры
        }, 100); // Небольшая задержка для отображения красного квадрата
        return;
    }

    const nearbyMines = countNearbyMines(index);
    if (nearbyMines > 0) {
        cell.textContent = nearbyMines;
    } else {
        revealAdjacentCells(index);
    }

    if (checkWin()) {
        alert('Вы победили!');
        createGame();
    }
}

// Подсчёт мин рядом
function countNearbyMines(index) {
    const adjacentCells = getAdjacentCells(index);
    return adjacentCells.filter((i) => mines.includes(i)).length;
}

// Получение соседних ячеек
function getAdjacentCells(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (
                newRow >= 0 &&
                newRow < gridSize &&
                newCol >= 0 &&
                newCol < gridSize
            ) {
                neighbors.push(newRow * gridSize + newCol);
            }
        }
    }
    return neighbors;
}

// Открытие соседних ячеек
function revealAdjacentCells(index) {
    const adjacentCells = getAdjacentCells(index);
    for (const i of adjacentCells) {
        if (!cells[i].classList.contains('revealed')) {
            revealCell(i);
        }
    }
}

// Проверка на победу
function checkWin() {
    return cells.every(
        (cell, i) =>
            cell.classList.contains('revealed') || mines.includes(i)
    );
}

// Инициализация игры
createGame();
