import keycode from 'keycode';
import { ICharacter } from './types/types';

const charArray: ICharacter[] = [];
const fontSize = '16px';
const fontFamily = 'cp437';
const tileW = 8;
const tileH = 16;
const tilesH = 80;
const tilesV = 30;
const blockOffsetY = 12; // Hack

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const brush = {
  fgColor: 'white',
  bgColor: 'black',
};

const cursor = {
  x: 15,
  y: 10,
};

export function init() {
  createCanvas();
  window.onkeydown = handleKeyDown;
  requestAnimationFrame(mainLoop);
}

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.width = tilesH * tileW;
  canvas.height = tilesV * tileH;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  document.body.appendChild(canvas);
}

function mainLoop() {
  requestAnimationFrame(mainLoop);
  draw();
}

function handleKeyDown(e: KeyboardEvent) {
  if (!keycode.isEventKey(e, 'F5') && !keycode.isEventKey(e, 'F12')) {
    e.preventDefault();
  }

  let advanceCursor = false;
  let controlKey = false;

  // Cursor movement
  if (keycode.isEventKey(e, 'Left') && cursor.x !== 0) {
    controlKey = true;
    cursor.x -= 1;
  }

  if (keycode.isEventKey(e, 'Right') && cursor.x !== tilesH - 1) {
    controlKey = true;
    cursor.x += 1;
  }

  if (keycode.isEventKey(e, 'Up') && cursor.y !== 0) {
    controlKey = true;
    cursor.y -= 1;
  }

  if (keycode.isEventKey(e, 'Down') && cursor.y !== tilesV - 1) {
    controlKey = true;
    cursor.y += 1;
  }

  if (keycode.isEventKey(e, 'Space') && cursor.x !== tilesH - 1) {
    controlKey = true;
    addCharacter(' ');
    cursor.x += 1;
  }

  if (keycode.isEventKey(e, 'Enter')) {
    controlKey = true;
    cursor.x = 0;

    if (cursor.y !== tilesV - 1) {
      cursor.y += 1;
    }
  }

  // Edit keys
  if (keycode.isEventKey(e, 'Backspace')) {
    controlKey = true;
    cursor.x -= 1;
    removeCharacterAtCursor();
  }

  if (keycode.isEventKey(e, 'Delete')) {
    controlKey = true;
    removeCharacterAtCursor();
  }

  // Character keys
  // Todo: Hard-coded. Add charsets you can select
  if (keycode.isEventKey(e, 'F1')) {
    advanceCursor = true;
    controlKey = true;
    addCharacter('\u{00b0}');
  }

  if (keycode.isEventKey(e, 'F2')) {
    advanceCursor = true;
    controlKey = true;
    addCharacter('\u{00b1}');
  }

  if (keycode.isEventKey(e, 'F3')) {
    advanceCursor = true;
    controlKey = true;
    addCharacter('\u{00b2}');
  }

  if (keycode.isEventKey(e, 'F4')) {
    advanceCursor = true;
    controlKey = true;
    addCharacter('\u{00db}');
  }

  const validChar =
    (e.keyCode > 47 && e.keyCode < 58) || // number keys
    e.keyCode === 32 ||
    e.keyCode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (e.keyCode > 64 && e.keyCode < 91) || // letter keys
    (e.keyCode > 95 && e.keyCode < 112) || // numpad keys
    (e.keyCode > 185 && e.keyCode < 193) || // ;=,-./` (in order)
    (e.keyCode > 218 && e.keyCode < 223); // [\]' (in order)

  if (!controlKey && validChar) {
    advanceCursor = true;
    addCharacter(keycode(e));
  }

  if (advanceCursor && cursor.x !== tilesH - 1) {
    cursor.x += 1;
  }
}

function getCharIndexAtPos(x: number, y: number) {
  return charArray.findIndex(c => c.x === cursor.x && c.y === cursor.y);
}

function getCharAtCursor(): ICharacter | undefined {
  return charArray.find(c => c.x === cursor.x && c.y === cursor.y);
}

function addCharacter(charRepr: string) {
  const existing = getCharIndexAtPos(cursor.x, cursor.y);
  const character: ICharacter = {
    charRepr,
    x: cursor.x,
    y: cursor.y,
    bgColor: brush.bgColor,
    fgColor: brush.fgColor,
  };

  if (existing !== -1) {
    charArray[existing] = character;
  } else {
    charArray.push(character);
  }
}

function removeCharacterAtCursor() {
  const charIndex = getCharIndexAtPos(cursor.x, cursor.y);

  if (charIndex !== -1) {
    charArray.splice(charIndex, 1);
  }
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw characters
  ctx.fillStyle = 'white';
  ctx.font = `${fontSize} ${fontFamily}`;

  for (const char of charArray) {
    ctx.fillText(char.charRepr, char.x * tileW, char.y * tileH + blockOffsetY);
  }

  ctx.fillText('abcdefghijk', 0, 32);
  ctx.fillText('\u{00db}\u{00b2}\u{00b1}\u{00b0}', 0, blockOffsetY);

  // Cursor
  // Todo: inverse cursor color (ctx.globalCompositeOperation('lighten'))
  ctx.fillStyle = brush.fgColor;
  ctx.fillRect(cursor.x * tileW, cursor.y * tileH + tileH - 2, tileW, 2);
}
