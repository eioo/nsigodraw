import { Editor } from '.';
import { IDirection } from '../types/types';

export class Cursor {
  public x = 3;
  public y = 1;

  constructor(private editor: Editor) {}

  public move(direction: IDirection) {
    const { tilesH, tilesV } = this.editor;

    const dir = direction.toLowerCase();

    if (dir === 'left' && this.x !== 0) {
      this.x -= 1;
    } else if (dir === 'right' && this.x !== tilesH - 1) {
      this.x += 1;
    } else if (dir === 'up' && this.y !== 0) {
      this.y -= 1;
    } else if (dir === 'down' && this.y !== tilesV - 1) {
      this.y += 1;
    }
  }

  public moveTo(pos: { x?: number; y?: number }) {
    if (pos.x !== undefined) {
      this.x = pos.x;
    }

    if (pos.y !== undefined) {
      this.y = pos.y;
    }
  }

  public removeCharacterAt() {
    const charIndex = this.editor.getCharIndexAtPos(this.x, this.y);

    if (charIndex !== -1) {
      this.editor.charArray.splice(charIndex, 1);
    }
  }
}
