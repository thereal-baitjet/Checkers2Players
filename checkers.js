const board = document.getElementById('board');
const rows = 8;
const cols = 8;
let currentPlayer = 'red';
let selectedPiece = null;
let validMoves = [];

// Create the board
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = row;
            tile.dataset.col = col;
            if ((row + col) % 2 === 1) {
                tile.classList.add('dark');
                tile.addEventListener('click', () => onTileClick(tile));
            } else {
                tile.classList.add('light');
            }
            board.appendChild(tile);

            // Place pieces in starting positions
            if ((row + col) % 2 === 1 && row < 3) {
                createPiece(tile, 'black');
            } else if ((row + col) % 2 === 1 && row > 4) {
                createPiece(tile, 'red');
            }
        }
    }
}

// Create a checker piece
function createPiece(tile, color) {
    const piece = document.createElement('div');
    piece.classList.add('piece', color);
    piece.dataset.color = color;
    tile.appendChild(piece);
    piece.addEventListener('click', (event) => onPieceClick(event, piece));
}

// Handle piece click
function onPieceClick(event, piece) {
    event.stopPropagation();
    if (piece.dataset.color !== currentPlayer) return;

    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
        clearValidMoves();
    }

    selectedPiece = piece;
    piece.classList.add('selected');
    highlightValidMoves(piece);
}

// Handle tile click
function onTileClick(tile) {
    if (selectedPiece && validMoves.includes(tile)) {
        movePiece(selectedPiece, tile);
        togglePlayer();
        clearValidMoves();
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    }
}

// Highlight valid moves for a selected piece
function highlightValidMoves(piece) {
    const currentRow = parseInt(piece.parentElement.dataset.row);
    const currentCol = parseInt(piece.parentElement.dataset.col);
    const direction = piece.dataset.color === 'red' ? -1 : 1;

    validMoves = [];

    // Check forward left and forward right moves
    [[direction, -1], [direction, 1]].forEach(([rowOffset, colOffset]) => {
        const newRow = currentRow + rowOffset;
        const newCol = currentCol + colOffset;
        const targetTile = getTile(newRow, newCol);
        if (targetTile && !targetTile.querySelector('.piece')) {
            validMoves.push(targetTile);
            targetTile.classList.add('highlight');
        } else if (targetTile && targetTile.querySelector('.piece') && targetTile.querySelector('.piece').dataset.color !== currentPlayer) {
            const jumpRow = newRow + rowOffset;
            const jumpCol = newCol + colOffset;
            const jumpTile = getTile(jumpRow, jumpCol);
            if (jumpTile && !jumpTile.querySelector('.piece')) {
                validMoves.push(jumpTile);
                jumpTile.classList.add('highlight');
            }
        }
    });
}

// Get tile by row and column
function getTile(row, col) {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        return board.querySelector(`.tile[data-row='${row}'][data-col='${col}']`);
    }
    return null;
}

// Move a piece to a new tile
function movePiece(piece, tile) {
    piece.parentElement.removeChild(piece);
    tile.appendChild(piece);

    // Check if the piece should be crowned as a king
    const row = parseInt(tile.dataset.row);
    if ((piece.dataset.color === 'red' && row === 0) || (piece.dataset.color === 'black' && row === 7)) {
        piece.classList.add('king');
    }
}

// Toggle the current player
function togglePlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    console.log(`Current player: ${currentPlayer}`);
}

// Clear highlighted valid moves
function clearValidMoves() {
    validMoves.forEach(tile => tile.classList.remove('highlight'));
    validMoves = [];
}

createBoard();