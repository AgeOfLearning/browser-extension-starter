console.log('on page');

let limit = 50;
let interval = setInterval(() => {
  if (typeof window.aofljs !== 'undefined') {
    console.log(aofljs);
    clearInterval(interval);
  } else if (limit-- === 0) {
    clearInterval(interval);
  }
}, 100);
