import keycode from 'keycode';
import { ICharacter, IDirection } from '../types/types';

const charArray: ICharacter[] = [];
const fontSize = '16px';
const fontFamily = 'IBM EGA8';
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
  x: 3,
  y: 1,
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
  ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
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

  let controlKey = false;

  // Debug
  console.log('Key down:', keycode(e));

  // Cursor movement
  switch (keycode(e)) {
    case 'left':
      controlKey = true;
      moveCursor('left');
      break;

    case 'right':
      controlKey = true;
      moveCursor('right');
      break;

    case 'up':
      controlKey = true;
      moveCursor('up');
      break;

    case 'down':
      controlKey = true;
      moveCursor('down');
      break;

    case 'space':
      controlKey = true;
      addCharacter(' ');
      moveCursor('right');
      break;

    case 'enter':
      controlKey = true;
      cursor.x = 0;
      moveCursor('down');
      break;

    // Edit keys
    case 'backspace':
      controlKey = true;
      moveCursor('left');
      removeCharacterAtCursor();
      break;

    case 'delete':
      controlKey = true;
      removeCharacterAtCursor();
      break;

    // Character keys
    // Todo: Hard-coded. Add charsets you can select
    case 'f1':
      controlKey = true;
      addCharacter('\u{2591}');
      moveCursor('right');
      break;

    case 'f2':
      controlKey = true;
      addCharacter('\u{2592}');
      moveCursor('right');
      break;

    case 'f3':
      controlKey = true;
      addCharacter('\u{2593}');
      moveCursor('right');
      break;

    case 'f4':
      controlKey = true;
      addCharacter('\u{2588}');
      moveCursor('right');
      break;
  }

  const validKey = e.key.length === 1;

  if (!controlKey && validKey && e.key) {
    addCharacter(e.key);
    moveCursor('right');
  }
}

function moveCursor(direction: IDirection) {
  const dir = direction.toLowerCase();

  if (dir === 'left' && cursor.x !== 0) {
    cursor.x -= 1;
  } else if (dir === 'right' && cursor.x !== tilesH - 1) {
    cursor.x += 1;
  } else if (dir === 'up' && cursor.y !== 0) {
    cursor.y -= 1;
  } else if (dir === 'down' && cursor.y !== tilesV - 1) {
    cursor.y += 1;
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
    key: charRepr,
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
    ctx.fillText(char.key, char.x * tileW, char.y * tileH + blockOffsetY);
  }

  // Cursor
  // Todo: inverse cursor color (ctx.globalCompositeOperation('lighten'))
  ctx.fillStyle = brush.fgColor;
  ctx.fillRect(cursor.x * tileW, cursor.y * tileH + tileH - 2, tileW, 2);
}
