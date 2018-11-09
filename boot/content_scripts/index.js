import pageScript from 'raw-loader!./js';

let node = document.head || document.documentElement;
let injectables = [
  {
    name: 'page-script',
    label: 'aofljs page script',
    content: pageScript,
    attributes: {
      'data-id': chrome.runtime.id
    }
  }
];

let injectScript = (injectable, elem = node) => {
  try {
    let script = document.createElement('script');

    script.innerHTML = injectable.content;

    if (typeof injectable.attributes !== 'undefined') {
      for (let attr in injectable.attributes) {
        if (!injectable.attributes.hasOwnProperty(attr)) continue;
        script.setAttribute(attr, injectable.attributes[attr]);
      }
    }

    elem.insertBefore(script, elem.firstChild);
    script.parentNode.removeChild(script);
  } catch (e) {
  }
};

for (let i = 0; i < injectables.length; i++) {
  injectScript(injectables[i]);
}

/* eslint-disable */
 chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

console.log('%cInjected :)', 'background: gold; font-size: 25px;');
setTimeout(() => {
	// console.log(aofljs.store.getState());
}, 500);
