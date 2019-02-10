import { ICharacter } from '../types/types';
import { Charsets } from './charsets';
import { Cursor } from './cursor';
import { KeyHandler } from './keyHandler';
import { Palette } from './palette';

export class Editor {
  public palette: Palette;
  public charsets: Charsets;
  public keyHandler: KeyHandler;
  public cursor: Cursor;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public charArray: ICharacter[] = [];
  public documentBgColor = '#000000';
  public cursorColor = '#ffffff';
  public fontSize = '16px';
  public fontFamily = 'IBM VGA8';
  public tileW = 8;
  public tileH = 16;
  public tilesH = 80;
  public tilesV = 30;
  public blockOffsetY = 12;

  constructor() {
    this.keyHandler = new KeyHandler(this);
    this.cursor = new Cursor(this);
    this.palette = new Palette(this);
    this.charsets = new Charsets(this);

    this.init();
  }

  public init() {
    this.createCanvas();
    window.oncontextmenu = e => e.preventDefault();
    window.onkeydown = this.keyHandler.handleKeyDown;
    requestAnimationFrame(this.draw);
  }

  public getCharIndexAtPos(x: number, y: number) {
    return this.charArray.findIndex(c => c.x === x && c.y === y);
  }

  public addCharacter = (charRepr: string) => {
    const { cursor, palette } = this;
    const existing = this.getCharIndexAtPos(cursor.x, cursor.y);

    const character: ICharacter = {
      key: charRepr,
      x: cursor.x,
      y: cursor.y,
      bgColor: palette.bgColor,
      fgColor: palette.fgColor,
    };

    if (existing !== -1) {
      this.charArray[existing] = character;
    } else {
      this.charArray.push(character);
    }
  };

  private createCanvas() {
    const { tilesH, tilesV, tileH, tileW } = this;

    this.canvas = document.querySelector(
      '.document > canvas'
    ) as HTMLCanvasElement;
    this.canvas.width = tilesH * tileW;
    this.canvas.height = tilesV * tileH;
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
  }

  private draw = () => {
    const { canvas, ctx, cursor, tileH, tileW, blockOffsetY } = this;

    ctx.fillStyle = this.documentBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw characters
    ctx.font = `${this.fontSize} ${this.fontFamily}`;

    for (const char of this.charArray) {
      ctx.fillStyle = char.bgColor;
      ctx.fillRect(char.x * tileW, char.y * tileH, tileW, tileH);

      ctx.fillStyle = char.fgColor;
      ctx.fillText(char.key, char.x * tileW, char.y * tileH + blockOffsetY);
    }

    // Cursor
    // Todo: inverse cursor color (ctx.globalCompositeOperation('lighten'))
    ctx.fillStyle = this.cursorColor;
    ctx.fillRect(cursor.x * tileW, cursor.y * tileH + tileH - 2, tileW, 2);

    requestAnimationFrame(this.draw);
  };
}
