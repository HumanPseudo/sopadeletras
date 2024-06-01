const wordsByLevel = [
    ["CASA", "PERRO", "SOL", "MAR"],
    ["GATO", "LUNA", "CIELO", "FLOR"],
    ["RÍO", "MONTE", "ARBOL", "NUBE"],
    ["ESTRELLA", "MUNDO", "ESPACIO", "COMETA"],
    ["UNIVERSO", "GALAXIA", "PLANETA", "SATURNO"]
];

const gridSizeByLevel = [10, 12, 14, 16, 18];
let currentLevel = 0;
let wordGrid;
let currentSelection = [];
let wordsFound = [];

document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    document.getElementById('generateNew').addEventListener('click', startNewGame);
});

function startNewGame() {
    currentLevel = 0;
    initializeLevel();
}

function initializeLevel() {
    const gridSize = gridSizeByLevel[currentLevel];
    const words = wordsByLevel[currentLevel];
    wordGrid = generateEmptyGrid(gridSize);
    currentSelection = [];
    wordsFound = [];
    placeWordsInGrid(words, wordGrid);
    renderGrid(wordGrid, gridSize);
    renderWordsList(words);
}

function generateEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill('_'));
}

function placeWordsInGrid(words, grid) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * grid.length);
            const col = Math.floor(Math.random() * (grid.length - word.length));
            if (canPlaceWordAt(word, grid, row, col)) {
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
                placed = true;
            }
        }
    });
}

function canPlaceWordAt(word, grid, row, col) {
    for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '_') return false;
    }
    return true;
}

function renderGrid(grid, gridSize) {
    const container = document.getElementById('wordSearchContainer');
    container.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.textContent = cell === '_' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell;
            cellElement.dataset.index = rowIndex * gridSize + colIndex;
            cellElement.addEventListener('click', () => selectCell(rowIndex, colIndex, cellElement, gridSize));
            container.appendChild(cellElement);
        });
    });
}

function renderWordsList(words) {
    const wordsListContainer = document.getElementById('wordsList');
    wordsListContainer.innerHTML = '';
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);
        wordsListContainer.appendChild(wordElement);
    });
}

function selectCell(rowIndex, colIndex, cellElement, gridSize) {
    const index = rowIndex * gridSize + colIndex;
    if (currentSelection.includes(index)) return;
    cellElement.classList.add('selected');
    currentSelection.push(index);

    const selectedWord = currentSelection.map(idx => {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        return wordGrid[row][col];
    }).join('');

    const words = wordsByLevel[currentLevel];
    if (words.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
        wordsFound.push(selectedWord);
        alert(`¡Has encontrado la palabra "${selectedWord}"!`);
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.add('found');
        });

        document.querySelector(`[data-word="${selectedWord}"]`).classList.add('found');
        currentSelection = [];

        if (wordsFound.length === words.length) {
            if (currentLevel < wordsByLevel.length - 1) {
                currentLevel++;
                setTimeout(() => {
                    alert('¡Nivel completado! Pasando al siguiente nivel...');
                    initializeLevel();
                }, 1000);
            } else {
                setTimeout(() => {
                    alert('¡Has ganado todos los niveles!');
                    startNewGame();
                }, 1000);
            }
        }
    } else if (!words.some(word => word.startsWith(selectedWord))) {
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.remove('selected');
        });
        currentSelection = [];
    }
}
