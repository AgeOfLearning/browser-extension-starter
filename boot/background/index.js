// example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  // chrome.pageAction.show(sender.tab.id);
  console.log('message from ', sender);
    sendResponse();
  });

console.log('background.js');
