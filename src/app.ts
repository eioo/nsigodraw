import * as editor from './editor';

(() => {
  editor.init();
  console.log('Editor started');
})();

// Hack, parcel has issues with reloading canvas elements with HMR
// See: https://github.com/parcel-bundler/parcel/issues/289
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw new Error();
  });
}
