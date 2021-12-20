
var onpage = false
var destURL = "index.html"
var openTab;

//chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//    chrome.tabs.sendMessage(tabs[0].id, {action: "register"}, function(response) {});  
//});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo);
    if(!(onpage || navigator.onLine)){
        //Export the stored high score.
        chrome.tabs.update(undefined,{url:destURL})
        onpage = true
        openTab = tabId;
        
    }
});

chrome.tabs.onRemoved.addListener((tabId,tab) => {
    if(tabId == openTab){
        onpage = false;
    }
});

