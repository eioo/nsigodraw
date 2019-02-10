import keycode from 'keycode';
import { Editor } from '.';

export class KeyHandler {
  constructor(private editor: Editor) {}

  public handleKeyDown = (e: KeyboardEvent) => {
    if (!keycode.isEventKey(e, 'F5') && !keycode.isEventKey(e, 'F12')) {
      e.preventDefault();
    }

    const { addCharacter, cursor } = this.editor;
    const { getCharacter } = this.editor.charsets;
    let controlKey = false;

    // Debug
    console.log('Key down:', keycode(e));

    // Cursor movement
    const keyName = keycode(e);

    switch (keyName) {
      case 'left':
        controlKey = true;
        cursor.move('left');
        break;

      case 'right':
        controlKey = true;
        cursor.move('right');
        break;

      case 'up':
        controlKey = true;
        cursor.move('up');
        break;

      case 'down':
        controlKey = true;
        cursor.move('down');
        break;

      case 'space':
        controlKey = true;
        addCharacter(' ');
        cursor.move('right');
        break;

      case 'enter':
        controlKey = true;
        cursor.moveTo({ x: 0 });
        cursor.move('down');
        break;

      // Edit keys
      case 'backspace':
        controlKey = true;
        cursor.move('left');
        cursor.removeCharacterAt();
        break;

      case 'delete':
        controlKey = true;
        cursor.removeCharacterAt();
        break;

      // Character keys
      case 'f1':
      case 'f2':
      case 'f3':
      case 'f4':
      case 'f5':
      case 'f6':
      case 'f7':
      case 'f8':
      case 'f9':
      case 'f10':
      case 'f11':
      case 'f12':
        const index = Number(keyName.substr(1)) - 1;
        const char = getCharacter(index);

        controlKey = true;
        addCharacter(char);
        cursor.move('right');
        break;
    }

    const validKey = e.key.length === 1;

    if (!controlKey && validKey && e.key) {
      addCharacter(e.key);
      cursor.move('right');
    }
  };
}
