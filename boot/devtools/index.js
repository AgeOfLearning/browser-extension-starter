console.log('%cboot/devtools/index.html', 'background: blue; font-size: 50px;');
chrome.devtools.panels.create('aofl-js',
  '../../icons/icon48.png',
  '/devtools/index.html',
  function(panel) {
    console.log('panel invoked');
    // code invoked on panel creation
  }
);
