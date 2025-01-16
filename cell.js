export class Cell {
  constructor(gridElement, x, y) {
    // создание пустого див элемента
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  // метод сохраняет приточку внутри this ячейки
  linkTile(tile) {
    // остановка координат плиточки
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  // метод перезаписывает ссылку на привяязанную плиточку на значение null
  unlinkTile() {
    this.linkedTile = null;
  }

  // метод возвращает false/true в зависимости от того есть ли у ячейки привязанная плиточка
  isEmpty() {
    return !this.linkedTile;
  }

  // метод меняет координаты плиточки на новые и сохраняет ссылку на плиточку
  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  // отчищает значение второй плиточку на null
  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  // метод возвращает true когда к ячейке уже привязали плиточку на объединение
  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  // метод можно ли переместить плиточку на текую ячейку и вернуть true/false
  canAccept(newTile) {
    return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  // метод смены значения при объединении плиточек
  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
    // удалить вторую плиточку из верстки
    this.linkedTileForMerge.removeFromDOM();
    // отвязать вторую плиточку от ячейки
    this.unlinkTileForMerge();
  }
}