import { Cell } from "./cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Grid {
  constructor(gridElement) {
    this.cells = [];
    for (let i = 0; i < CELLS_COUNT; i++) {
      // добавление новой ячейки
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
      
    }

    // смещение плиточек вверх
    this.cellsGroupedByColumn = this.groupCellsByColumn();
    // смещение плиточек вниз
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
    // смещение плиточек влево
    this.cellsGroupedByRow = this.groupCellsByRow();
    // смещение плиточек вправо
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse());
  }

  getRandomEmptyCell() {
    // искать все пустые ячейки
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    // достать случайную 1 ячейку из всех пустых
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    // вернуть случайную пустую ячейку в конце метода
    return emptyCells[randomIndex];
  }

  // метод группировки ячейки в новый массив по вертикали(вверх,вниз)
  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, [])
  }

   // метод группировки ячейки в новый массив по горизонтали(влево,вправо)
  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, [])
  }
}