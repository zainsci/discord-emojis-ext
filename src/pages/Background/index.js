console.log('This is the background page.');
console.log('Put the background scripts here.');

console.log(chrome.commands);
chrome.commands.onCommand.addListener(function (command) {
  // if (command === 'open-popup') {
  // }
  console.log('onCommand event received for message: ', command);
});
