import { Editor } from '..';

const defaultPalette = [
  '#000000',
  '#575757',
  '#0000AB',
  '#5757FF',
  '#00AB00',
  '#57FF57',
  '#00ABAB',
  '#57FFFF',
  '#AB0000',
  '#FF5757',
  '#AB00AB',
  '#FF57FF',
  '#AB5700',
  '#FFFF57',
  '#ABABAB',
  '#FFFFFF',
];

export class Palette {
  public fgColor = defaultPalette[14]; // #ABABAB
  public bgColor = defaultPalette[0]; // #000000
  private fgEl: HTMLDivElement;
  private bgEl: HTMLDivElement;

  constructor(private editor: Editor) {
    const activeEl = document.querySelector('.active-colors') as HTMLDivElement;
    const paletteEl = document.querySelector('.palette') as HTMLDivElement;

    // Setup active colors
    this.fgEl = document.createElement('div');
    this.bgEl = document.createElement('div');
    this.setFgColor(this.fgColor);
    this.setBgColor(this.bgColor);
    activeEl.appendChild(this.fgEl);
    activeEl.appendChild(this.bgEl);

    // Setup palette colors
    defaultPalette.forEach(color => {
      const colorEl = document.createElement('div');
      colorEl.setAttribute('data-palette-color', color);
      colorEl.style.background = color;
      colorEl.onmousedown = e => this.handlePaletteClick(e, color);

      paletteEl.appendChild(colorEl);
    });
  }

  private setFgColor(color: string) {
    this.fgColor = color;
    this.fgEl.setAttribute('data-fg-color', color);
    this.fgEl.style.background = color;

    console.log('Primary color changed:', color);
  }

  private setBgColor(color: string) {
    this.bgColor = color;
    this.bgEl.setAttribute('data-bg-color', color);
    this.bgEl.style.background = color;

    console.log('Secondary color changed:', color);
  }

  private handlePaletteClick(event: MouseEvent, color: string) {
    // Left button
    if (event.button === 0) {
      return this.setFgColor(color);
    }

    // Right button
    if (event.button === 2) {
      this.setBgColor(color);
    }
  }
}
