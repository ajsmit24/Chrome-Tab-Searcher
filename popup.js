//get button
let searchBtn = document.getElementById('search');

//getting tabs
//----------------------------------------------------------------
var tabsArr=[];
var matchType={
	exact:false,
	contains:true,
	case:false
}
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
					var searchType={
						url:$("#check-url")[0].checked,
						title:$("#check-title")[0].checked,
					}
					matchType.exact=$("#check-exact")[0].checked;
					matchType.contains=$("#check-contains")[0].checked;
					matchType.case=$("#check-case")[0].checked;
					search(tabsArr,searchType,$("#search-box")[0].value);			
				}

			});
		}
	});
  };
  
//search tabs
//search types object
function search(searchArr,searchTypes,searchString){
	var foundTabs=[];
	console.log(searchArr,searchTypes,searchString)
	if(searchTypes.title){
		appendArrays(searchTitle(searchArr,searchString),foundTabs);
	}
	if(searchTypes.url){
		appendArrays(searchURL(searchArr,searchString),foundTabs);
	}
	console.log(foundTabs);
	displayRes(foundTabs);
}


function searchTitle(arrOfTabs,searchString){
	var matches=[];
	for(var i=0;i<arrOfTabs.length;i++){
		if(isMatch(arrOfTabs[i].title,searchString)){
			matches.push(arrOfTabs[i])
		}
	}
	return matches;
}

function searchURL(arrOfTabs,searchString){
	var matches=[];
	for(var i=0;i<arrOfTabs.length;i++){
		if(isMatch(arrOfTabs[i].url,searchString)){
			matches.push(arrOfTabs[i])
		}
	}
	return matches;
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

function isMatch(stringToSearch,searchString){
	if(!matchType.case){
		searchString=searchString.toLowerCase();
		stringToSearch=stringToSearch.toLowerCase();
	}
	if(matchType.exact){
		return stringToSearch===searchString;
	}
	if(matchType.contains){
		return stringToSearch.indexOf(searchString)>-1;
	}
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
	var divsStr="<table>";
	for(var i=0;i<resArr.length;i++){
		var title="<div class='title'>"+resArr[i].title+"</div>";
		var div="<tr><div class='res'>"+title+"</div></tr>";
		divsStr+=div+"";
	}
	divsStr+="</table>";
	$("#search-box").after(divsStr);
	$(".res").click()
}

  
