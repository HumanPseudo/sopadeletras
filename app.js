// Listas de palabras para cada nivel
const wordsByLevel = [
    ["CASA", "PERRO", "SOL", "MAR"],
    ["GATO", "LUNA", "CIELO", "FLOR"],
    ["RÍO", "MONTE", "ARBOL", "NUBE"],
    ["ESTRELLA", "MUNDO", "ESPACIO", "COMETA"],
    ["UNIVERSO", "GALAXIA", "PLANETA", "SATURNO"]
];

// Tamaño de la cuadrícula para cada nivel
const gridSizeByLevel = [10, 12, 14, 16, 18];
let currentLevel = 0;
let wordGrid;
let currentSelection = [];
let wordsFound = [];

document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    document.getElementById('generateNew').addEventListener('click', startNewGame);
});

// Inicia un nuevo juego desde el nivel 0
function startNewGame() {
    currentLevel = 0;
    initializeLevel();
}

// Inicializa el nivel actual
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

// Genera una cuadrícula vacía de tamaño especificado
function generateEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill('_'));
}

// Coloca las palabras en la cuadrícula de forma aleatoria
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

// Verifica si una palabra se puede colocar en la posición especificada
function canPlaceWordAt(word, grid, row, col) {
    for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '_') return false;
    }
    return true;
}

// Renderiza la cuadrícula en el contenedor HTML
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

// Renderiza la lista de palabras en el contenedor HTML
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

// Maneja la selección de una celda en la cuadrícula
function selectCell(rowIndex, colIndex, cellElement, gridSize) {
    const index = rowIndex * gridSize + colIndex;
    if (currentSelection.includes(index)) return;
    cellElement.classList.add('selected');
    currentSelection.push(index);

    // Construye la palabra seleccionada
    const selectedWord = currentSelection.map(idx => {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        return wordGrid[row][col];
    }).join('');

    const words = wordsByLevel[currentLevel];
    // Verifica si la palabra seleccionada es una palabra válida
    if (words.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
        wordsFound.push(selectedWord);
        alert(`¡Has encontrado la palabra "${selectedWord}"!`);
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.add('found');
        });

        document.querySelector(`[data-word="${selectedWord}"]`).classList.add('found');
        currentSelection = [];

        // Si se encuentran todas las palabras, se pasa al siguiente nivel o se gana el juego
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
        // Si la selección no corresponde a ninguna palabra, se deseleccionan las celdas
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.remove('selected');
        });
        currentSelection = [];
    }
}
