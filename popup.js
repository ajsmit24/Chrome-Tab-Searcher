//Global vars
//get button
let searchBtn = document.getElementById('search');
//some html I need access to later;
var highlight1="<span class='highlight'>";
var highlight2="</span>";
var tabsArr=[];//storage once all tabs have been retrived
//options based on radio/check~~~
var matchType={
	exact:false,
	contains:true,
	case:false
}
var searchType={
	url:true,
	title:true,
}
//~~
var searchQuerry;//input string
//---------------------------------------------

//Enables hitting enter to search
var searchBox=document.getElementById("search-box")
	if(searchBox){
		searchBox.onclick=function(){
		$("body").keydown(function(event) {
  			if(event.which == 13){
				mainInit();
			  }
		});
	}}
		
//get all open tabs from all open windows
//fills tabArr does not return any thing
	var getTabs= function(windowID,callback){
		 chrome.tabs.getAllInWindow(windowID,function(data){
			for(var i=0;i<data.length;i++){
				tabsArr.push(data[i]);
			}
			callback();
		 });
	}
//bind search to search button
if(searchBtn){
  searchBtn.onclick = mainInit;
}

//The main search function
  function mainInit(element) {
	chrome.windows.getAll(function(data){
		for(var i=0;i<data.length;i++){
			//cycling through all open windows
			getTabs(data[i].id, function(){
				if(tabsArr[tabsArr.length-1].windowId==data[data.length-1].id){
					//settings---
					searchType.url=$("#check-url")[0].checked;
					searchType.title=$("#check-title")[0].checked;
					matchType.exact=$("#check-exact")[0].checked;
					matchType.contains=$("#check-contains")[0].checked;
					matchType.case=$("#check-case")[0].checked;
					searchQuerry=$("#search-box")[0].value;
					//---
					search(tabsArr,searchType,searchQuerry);			
				}

			});
		}
	});
  };
  
//search tabs
//search types object
function search(searchArr,searchTypes,searchString){
	var foundTabs=[];
	if(searchTypes.title){
		//if settings says to search title
		appendArrays(searchTitle(searchArr,searchString),foundTabs);
	}
	if(searchTypes.url){
		//if settings says to search url
		appendArrays(searchURL(searchArr,searchString),foundTabs);
	}
	displayRes(foundTabs);
}

function searchTitle(arrOfTabs,searchString){
	var matches=[];
	for(var i=0;i<arrOfTabs.length;i++){
		if(isMatch(arrOfTabs[i].title,searchString)){
			matches.push(arrOfTabs[i]);
		}
	}
	return matches;
}

function searchURL(arrOfTabs,searchString){
	var matches=[];
	for(var i=0;i<arrOfTabs.length;i++){
		if(isMatch(arrOfTabs[i].url,searchString)){
			matches.push(arrOfTabs[i]);
		}
	}
	return matches;
}
//helpers
function addHighLights(res,searchString){
	var index=res.toLowerCase().indexOf(searchString.toLowerCase());
	if(matchType.case){
		index=res.indexOf(searchString);
	}
	
	if(index<0){
		return res;
	}
	var mid=res.substring(index,index+searchString.length);
	return res.substring(0,index)+highlight1+mid+highlight2+res.substring(index+searchString.length);
}
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

function alreadyFound(tab,arr){
	for(var i=0;i<arr.length;i++){
		if(tab.windowId==arr[i].windowId&&tab.index==arr[i].index){
			return true;
		}
	}
	return false;
}

//display results
var gt;
function displayRes(resArr){
	var divsStr="<div id='resDiv'>";
	var ser=$("#search-box")[0].value;
	$("#resDiv").remove();
	$(".err").remove();
	$(".success").remove();
	for(var i=0;i<resArr.length;i++){
		var title="<div class='title'>"+resArr[i].title+"</div>";
		if(searchType.title){
			title="<div class='title'>"+addHighLights(resArr[i].title,ser)+"</div>";
		}
		var url="<div class='url'>"+resArr[i].url+"</div>";
		if(searchType.url){
			url="<div class='url'>"+addHighLights(resArr[i].url,ser)+"</div>";
		}
		var div="<div class='res' data-id='"+resArr[i].id+"'>"+title+url+"</div>";
		divsStr+=div+"";
	}
	divsStr+="</div>";
	var searchDis=displaySearchQuerry(searchQuerry);
	if(resArr.length<1){
		divsStr="<div class='err'>No results found for <i>"+searchDis+"</i></div>"
	}else{
		divsStr="<div class='success'>Displaying results for <i>"+searchDis+"</i></div>"+divsStr;
	}
	$("#search-box").after(divsStr);
	$(".res").click(function(){
		chrome.tabs.get(parseInt($(this)[0].dataset.id),function(data){
			gt=data;
			chrome.tabs.duplicate(gt.id);
			chrome.tabs.remove(gt.id);
		});
	});
}

function displaySearchQuerry(str){
	var retVal="";
	var escapeList=["<",">",'"',"&","'"];
	var replacers=["&lt;","&gt;","&quot;","&amp;","&apos;"];
	for(var i=0;i<str.length;i++){
		var isOnList=false;
		for(var j=0;j<escapeList.length;j++){
			if(str.substring(i,i+1)===escapeList[j]){
				retVal+=replacers[j];
				break;
			}else{
				if(j==escapeList.length-1){
					retVal+=str.substring(i,i+1);
				}
			}
		}
	}
	return retVal;
}