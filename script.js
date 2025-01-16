import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");

// класс хранящий все ячейки
const grid = new Grid(gameBoard);
// рандомное добавление начальной плиточки с цифрой
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;

    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;

    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;

    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;

    default:
      setupInputOnce();
      return;
  }

  // после каждого перемещения добавлять новую плиточку
  const newTIle = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTIle);

  // проигрыш
  if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTIle.waitForAnimationEnd();
    alert("Try again!");
    return;
  }

  setupInputOnce();
}

// сдвинуть плиточки вверх
async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

// сдвинуть плиточки вниз
async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

// сдвинуть плиточки влево
async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

// сдвинуть плиточки вправо
async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  // создание пустого массива для корректного отображения анимации перемещения плиточек
  const promises = [];
  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  // дождаться окончания анимации и перейти к объединению плиточек
  await Promise.all(promises);

  // смена значения при объединении плиточек
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

// принимает сгруппированные в столбцы ячейки
function slideTilesInGroup(group, promises) {
  for (let i=1; i<group.length; i++) {
    // если ячейка пустая(без плиточки) то прервать текую итерацию цикла
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    // целевая ячейка
    let targetCell;
    let j = i -1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    // если не найдена целевая ячейка для перемещения то прервать текую итерацию цикла
    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    // если найдена целевая ячейка для перемещения и она пустая
    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else { // целевая ячейка с плиточкой
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    // освободить текущую ячейку от плиточки
    cellWithTile.unlinkTile();
  }
}

// функция проверки есть ли место чтоб ячейки двигались вверх
function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}
// функция проверки есть ли место чтоб ячейки двигались вниз
function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}
// функция проверки есть ли место чтоб ячейки двигались влево
function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}
// функция проверки есть ли место чтоб ячейки двигались вправо
function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

// функция проверки что хоть в одном из объединенных столбцов есть возможность двигаться вверх
function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    // самая верхняя ячейка и выше неё двигаться некуда
    if (index === 0) {
      return false;
    }

    // ячейка пустая и ей двигаться некуда
    if (cell.isEmpty()) {
      return false
    }

    // проверка может ли соседняя ячейка принять плиточку с текущей ячейки и возврат этой ячейки
    const targetCell = group[index -1];
    return targetCell.canAccept(cell.linkedTile);
  });
}