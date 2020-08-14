import { UI } from './UI.js';
import { Cell } from './Cell.js';
import { Timer } from './Timer.js';
import { Counter } from './Counter.js';

class Game extends UI {
  constructor() {
    super();
  }
  #config = {
    easy: {
      rows: 8,
      cols: 8,
      mines: 10,
    },
    medium: {
      rows: 16,
      cols: 16,
      mines: 40,
    },
    expert: {
      rows: 16,
      cols: 30,
      mines: 99,
    },
  };

  #timer = new Timer();
  #counter = new Counter();

  #isGameFinished = false;
  #numberOfRows = null;
  #numberOfCols = null;
  #numberOfMines = null;

  #cells = [];
  #cellsElements = null;

  #board = null;

  initializeGame() {
    this.#handleElements();
    this.#timer.init();
    this.#counter.init();
    // this.#addButtonsEventListeners();
    this.#newGame();
  }
  #newGame(
    rows = this.#config.easy.rows,
    cols = this.#config.easy.cols,
    mines = this.#config.easy.mines
  ) {
    this.#numberOfRows = rows;
    this.#numberOfCols = cols;
    this.#numberOfMines = mines;
    this.#timer.startTimer();
    // this.#timer.resetTimer();
    this.#counter.setValue(this.#numberOfMines);
    // this.#cellsToReveal =
    //   this.#numberOfCols * this.#numberOfRows - this.#numberOfMines;
    this.#setStyles();
    this.#generateCells();
    this.#renderBoard();
    this.#placeMinesInCells();
    this.#cellsElements = this.getElements(this.UiSelectors.cell);
    // this.#buttons.reset.changeEmoticon('neutral');
    // this.#isGameFinished = false;
    // this.#revealedCells = 0;
    this.#addCellsEventListeners();
  }

  #endGame(isWin) {
    this.#isGameFinished = true;
    this.#timer.stopTimer();
    // this.#modal.buttonText = 'Close';
    if (!isWin) {
      this.#revealMines();
      // this.#modal.infoText = 'You lost, try again!';
      // this.#buttons.reset.changeEmoticon('negative');
      // this.#modal.setText();
      // this.#modal.toggleModal();
      // return;
    }
    // this.#modal.infoText =
    //   this.#timer.numberOfSeconds < this.#timer.maxNumberOfSeconds
    //     ? `You won, it took you ${
    //         this.#timer.numberOfSeconds
    //       } seconds, congratulations!`
    //     : `You won, congratulations!`;
    // this.#modal.setText();
    // this.#modal.toggleModal();
    // this.#buttons.reset.changeEmoticon('positive');
  }

  #handleElements() {
    this.#board = this.getElement(this.UiSelectors.board);
  }

  #addCellsEventListeners() {
    this.#cellsElements.forEach((element) => {
      element.addEventListener('click', this.#handleCellClick);
      element.addEventListener('contextmenu', this.#handleCellContextMenu);
    });
  }

  #generateCells() {
    // this.#cells.length = 0;
    for (let row = 0; row < this.#numberOfRows; row++) {
      this.#cells[row] = [];
      for (let col = 0; col < this.#numberOfCols; col++) {
        this.#cells[row].push(new Cell(col, row));
      }
    }
  }
  #renderBoard() {
    // this.board.innerHTML = '';
    // while (this.#board.firstChild) {
    //   this.#board.removeChild(this.#board.lastChild);
    // }
    this.#cells.flat().forEach((cell) => {
      this.#board.insertAdjacentHTML('beforeend', cell.createElement());
      cell.element = cell.getElement(cell.selector);
    });
  }

  #placeMinesInCells() {
    let minesToPlace = this.#numberOfMines;

    while (minesToPlace) {
      const rowIndex = this.#getRandomInteger(0, this.#numberOfRows - 1);
      const colIndex = this.#getRandomInteger(0, this.#numberOfCols - 1);

      const cell = this.#cells[rowIndex][colIndex];

      const hasCellMine = cell.isMine;

      if (!hasCellMine) {
        cell.addMine();
        minesToPlace--;
      }
    }
  }

  #handleCellClick = (e) => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    this.#clickCell(this.#cells[rowIndex][colIndex]);
  };

  #handleCellContextMenu = (e) => {
    e.preventDefault();

    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    const cell = this.#cells[rowIndex][colIndex];

    if (cell.isReveal) return;
    if (cell.isReveal || this.#isGameFinished) return;

    if (cell.isFlagged) {
      this.#counter.increment();
      cell.toggleFlag();
      return;
    }
    if (!!this.#counter.value) {
      this.#counter.decrement();
      cell.toggleFlag();
    }
  };

  #clickCell(cell) {
    if (cell.isFlagged || this.#isGameFinished) return;
    if (cell.isMine) {
      this.#endGame(false);
    }
    cell.revealCell();
    // this.#setCellValue(cell);

    // if (this.#revealedCells === this.#cellsToReveal && !this.#isGameFinished) {
    //   this.#endGame(true);
    // }
  }

  #revealMines() {
    this.#cells
      .flat()
      .filter(({ isMine }) => isMine)
      .forEach((cell) => cell.revealCell());
  }

  #setStyles() {
    document.documentElement.style.setProperty(
      '--cells-in-row',
      this.#numberOfCols
    );
  }

  #getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

window.onload = function () {
  const game = new Game();

  game.initializeGame();
};
