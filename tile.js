export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    // задать начальной плиточке рандомное значение 2 либо 4
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  // метод меняет значения x, y внутри плиточки на новые
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty("--x", x);
    this.tileElement.style.setProperty("--y", y);
  }

  // метод меняющий значение плиточки, текст и цвет
  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    // логика изменения цвета
    const bgLighness = 100 - Math.log2(value) * 9; // 2 -> 100 - 1*9 -> 91 - самая светлая плиточка; 2048 -> 100 - 11*9 -> 1 - самая темная плиточка
    this.tileElement.style.setProperty("--bg-lightness", `${bgLighness}%`);
    this.tileElement.style.setProperty("--text-lighness", `${bgLighness < 50 ? 90 : 10}%`);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  // метод возвращает promise который завершится когда закончится анимация перемещения плиточки
  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener("transitionend", resolve, { once: true });
    });
  }

  // метод возвращает promise который завершится когда закончится анимация перемещения плиточки (при проигрыше)
  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener("animationend", resolve, { once: true });
    });
  }
}