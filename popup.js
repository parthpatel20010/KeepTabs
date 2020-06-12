

 var createButton = document.querySelector('button');
  var links = document.getElementsByClassName("links");
 var checkbox = document.querySelector("input[name=notify]");
 createButton.addEventListener('click', function() { 
 	var number = document.getElementById('number').value;
 	if(number == '' || number < 1) {
 		alert("Please enter a positive number >= 1 minute")
 	} else {
 		document.getElementById('minutes').innerHTML = 'Will delete tabs that are untouched for: '+number + ' minutes';
	  	chrome.runtime.sendMessage({delay: number}, function(response) {

		});		
 	}

 });


 checkbox.addEventListener('click', function() { 
 	  	chrome.runtime.sendMessage({check2: checkbox.checked});	

 });
window.onload = function() {
  	  	chrome.runtime.sendMessage({sendMinutes: true}, function(response) {
  	  		document.getElementById('minutes').innerHTML = 'Will delete tabs that are untouched for: '+response.resp + ' minutes';
  	  		document.getElementById('notify').checked = response.check;
  	  		if(response.urls.length > 0){
  	  			document.getElementById('collapseExample').innerHTML = "";
  	  		}
  	  		for(var i = 0; i < response.urls.length; i++){
  	  			 var date = new Date(response.urls[i][1].toString())
  	  			 if(date.getMinutes() < 10){
  	  			 	var time = 'Deleted at: '+ date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear()+' '+date.getHours()+':0'+date.getMinutes()
  	  			 } else {
  	  			 	var time = 'Deleted at: '+ date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()
  	  			 }
  	  			 
  	  			 document.getElementById('collapseExample').innerHTML+='<div class="card card-body"><a class="links" data-value="'+response.urls[i][0].toString()+'" href="'+response.urls[i][0].toString()+'">'+response.urls[i][0].toString().substring(0,30)+"...</a><br><p>"+time+"</p></div>"
  	  		}
  	  		for (var i = 0; i < links.length; i++) {
			    links[i].addEventListener('click', function() { 
			 	  chrome.runtime.sendMessage({openTab: this.dataset.value}, function(response) {

				   });	

			 	});
			}
		});	

}

