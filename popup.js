//get button
let searchBtn = document.getElementById('search');

//getting tabs
//----------------------------------------------------------------
var tabsArr=[];
	var getTabs= function(windowID,callback){
		 chrome.tabs.getAllInWindow(windowID,function(data){
			 console.log(data);
			for(var i=0;i<data.length;i++){
				tabsArr.push(data[i]);
			}
			callback();
		 });
	}
	
  searchBtn.onclick = function(element) {
	  console.log("@@@")
	chrome.windows.getAll(function(data){
		console.log(data);
		for(var i=0;i<data.length;i++){
			getTabs(data[i].id, function(){
				if(tabsArr[tabsArr.length-1].windowId==data[data.length-1].id){
					console.log("fin",tabsArr);				
				}

			});
		}
	});
  };
  
//search tabs
function search(searchType){
	var foundTabs=[];
	/*if(searchCon1){
		appendArrays(searchTitle(foundTabs),foundTabs);
	}
	if(searchCon2){
		appendArrays(searchTitle(foundTabs),foundTabs);
	}*/
}


function searchTitle(arrOfTabs){
	
}

function searchURL(arrOfTabs){
	
}
//helpers

/*Takes two arrays and adds the unique elements
 *does not get rid of existing dups in each array
 *arr1 is the array being added to arr2
 */
function appendArrays(arr1,arr2){
	var finArr=arr2;
	for(var i=0;i<arr1.length;i++){
		if(!alreadyFound(arr1[i],arr2)){
			finArr.push(arr1[i]);
		}
	}
	return finArr;
}
//var c=tabsArr.slice();tabsArr.shift();appendArrays(c,tabsArr)

function alreadyFound(tab,arr){
	for(var i=0;i<arr.length;i++){
		if(tab.windowId==arr[i].windowId&&tab.index==arr[i].index){
			return true;
		}
	}
	return false;
}

//display results
function displayRes(resArr){
	var divArr=[];
	for(var i=0;i<resArr.length;i++){
		var div="<div>";
	}
}

  
