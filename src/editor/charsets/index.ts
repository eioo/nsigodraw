import { Editor } from '..';
import { $ } from '../../utils/querySelector';

const charsets = [
  [
    '\u{2591}',
    '\u{2592}',
    '\u{2593}',
    '\u{2588}',
    '\xa0', // &nbsp;
    '\u{2580}',
    '\u{2584}',
    '\u{258C}',
    '\u{2590}',
    '\u{25A0}',
    '\u{25AA}',
    '\xa0', // &nbsp;
  ],
];

export class Charsets {
  private charsetIndex = 0;
  private charsetEl = $('.charset') as HTMLDivElement;

  constructor(private editor: Editor) {
    this.setCharset(0);
  }

  public getCharacter = (index: number) => {
    const currentCharset = charsets[this.charsetIndex];
    return currentCharset[index];
  };

  public setCharset(index: number) {
    this.charsetIndex = index;
    this.updateCharset();

    console.log('Charset loaded');
  }

  private updateCharset() {
    const { palette } = this.editor;
    const currentCharset = charsets[this.charsetIndex];

    currentCharset.forEach((char, i) => {
      const outerDiv = document.createElement('div');
      const label = document.createElement('label');
      const innerDiv = document.createElement('div');

      outerDiv.setAttribute('data-character', char);
      label.textContent = `F${i + 1}`;

      innerDiv.textContent = char;
      innerDiv.style.background = palette.bgColor;
      innerDiv.style.color = palette.fgColor;

      outerDiv.appendChild(label);
      outerDiv.appendChild(innerDiv);
      this.charsetEl.appendChild(outerDiv);
    });
  }
}
