import { Editor } from './editor';

(() => {
  const editor = new Editor();
  console.log('Editor started');
})();

// Hack, parcel has issues with reloading canvas elements with HMR
// See: https://github.com/parcel-bundler/parcel/issues/289
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
    throw new Error();
  });
}
