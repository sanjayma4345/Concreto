chrome.action.onClicked.addListener((tab) => {
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Concreto extension installed');
});
