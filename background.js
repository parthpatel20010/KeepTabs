
var tab_list = []
var minutes = 180;
var checked = true;
var active2 = 0
var timeoutId = 0
var urls = []
chrome.tabs.onActivated.addListener(function(active) {
	    var d = new Date();
		var n = d.getTime();
		active2 = active.tabId;
		for (var i = 0; i < tab_list.length; i++) {
			if (tab_list[i].id == active.tabId){
				tab_list[i].time_created = n;
			}
		}
})	

function checkStaleTabs(){
    	var d = new Date();
		var n = d.getTime();
		var toDelete = []
		var tabs = []
		if (urls.length > 30){
			urls = []
		}
		for (var i = 0; i < tab_list.length; i++) {
			if (tab_list[i].id == active2){
				tab_list[i].time_created = n;
			} else if ((n-tab_list[i].time_created)/60000 > minutes) {
				//set tab to different color
				if(checked) {
						chrome.tabs.highlight({tabs: tab_list[i].tab.index})
						var r = confirm("Delete this tab? You haven't used it for a while...")
						if (r == true) {
							toDelete.push(tab_list[i].id)
							tabs.push(tab_list[i].tab.index)
							urls.push([tab_list[i].tab.url,d])

						} else {
							tab_list[i].time_created = n;
						}	

				} else {
					toDelete.push(tab_list[i].id)
					tabs.push(tab_list[i].tab.index)
					urls.push([tab_list[i].tab.url,d])
				}
			}
		}
		chrome.tabs.remove(toDelete)    
    timeoutId = setTimeout(checkStaleTabs, minutes*10000);
}

chrome.tabs.onCreated.addListener(function(tab){
	var d = new Date();
	var n = d.getTime();
	tab_list.push({'id':tab.id,'time_created':n,'tab':tab})
})

chrome.tabs.onMoved.addListener(function(tabid, info){
	for (var x = 0; x < tab_list.length; x++){
		if(tab_list[x].id == tabid){
			var temp = tab_list[x]
			if (info.toIndex - info.fromIndex > 0){
				tab_list[x] = tab_list[x+1]
				tab_list[x+1] = temp
				tab_list[x].tab.index -=1
				tab_list[x+1].tab.index +=1
			} else {
				tab_list[x] = tab_list[x-1]
				tab_list[x-1] = temp
				tab_list[x-1].tab.index -=1
				tab_list[x].tab.index +=1
			}
			break;
		}
		
	}
})





chrome.tabs.onRemoved.addListener(function(tabid, active){
	for (var x = 0; x < tab_list.length; x++){
		if(tab_list[x].id == tabid){
			for (var j = x; j < tab_list.length; j++) {
				tab_list[j].tab.index -=1
			}	
		}
		
	}
	tab_list = tab_list.filter(x => x.id !== tabid)
})





chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (request.delay){
  		minutes = request.delay;
  		clearTimeout(timeoutId);
  		checkStaleTabs();
  	} else if(request.sendMinutes) {
  		sendResponse({resp:minutes,check:checked,urls:urls})
  	} else if (request.check2 == true || request.check2 == false) {
  		checked = request.check2;
  	}else if(request.openTab){
  		chrome.tabs.create({url:request.openTab})
  	}
  	return true;

  });


 chrome.runtime.onInstalled.addListener(function(active) {

 	chrome.tabs.query({},function(tabs){
 		var d = new Date();
		var n = d.getTime();
 		for(var i = 0; i < tabs.length; i++) {
 			tab_list.push({'id':tabs[i].id, 'time_created': n, 'tab': tabs[i]})
 		}
 	})
 })

checkStaleTabs();



