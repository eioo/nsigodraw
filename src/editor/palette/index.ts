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

export let fgColor = defaultPalette[14]; // #ABABAB
export let bgColor = defaultPalette[0]; // #000000

let fgEl: HTMLDivElement;
let bgEl: HTMLDivElement;

export function init() {
  const activeEl = document.querySelector('.active-colors') as HTMLDivElement;
  const paletteEl = document.querySelector('.palette') as HTMLDivElement;

  // Setup active colors
  fgEl = document.createElement('div');
  bgEl = document.createElement('div');
  setFgColor(fgColor);
  setBgColor(bgColor);
  activeEl.appendChild(fgEl);
  activeEl.appendChild(bgEl);

  // Setup palette colors
  defaultPalette.forEach(color => {
    const colorEl = document.createElement('div');
    colorEl.setAttribute('data-palette-color', color);
    colorEl.style.background = color;
    colorEl.onmousedown = e => handlePaletteClick(e, color);

    paletteEl.appendChild(colorEl);
  });
}

// To-do: not sure if needed
function getPaletteColor(index: number) {
  const element = document.querySelectorAll('[data-palette-color]')[index];
  return element.getAttribute('data-palette-color');
}

function setFgColor(color: string) {
  fgColor = color;
  fgEl.setAttribute('data-fg-color', color);
  fgEl.style.background = color;

  console.log('Primary color changed:', color);
}

function setBgColor(color: string) {
  bgColor = color;
  bgEl.setAttribute('data-bg-color', color);
  bgEl.style.background = color;

  console.log('Secondary color changed:', color);
}

function handlePaletteClick(event: MouseEvent, color: string) {
  // Left button
  if (event.button === 0) {
    return setFgColor(color);
  }

  // Right button
  if (event.button === 2) {
    setBgColor(color);
  }
}
