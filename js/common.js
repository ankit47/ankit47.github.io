var waitingArr = ["En attente de contenu", "Esperando contenido", "Waiting for Content"];
var isWaiting = false;
var screenH = 1080;
var screenW = 1920;
var mediaSrc = "";
var ssW = 480;
var ssH = 270;
var wtNum = 0;

// ======= Network Status
function hasNetworkFx(caller, status){
  console.warn("hasNetworkFx ", caller, " - ", status);
  updateToolbar("offline", !status);
  // if(status){
  //   $('#toolbar .offline').hide();
  // } else{
  //   $('#toolbar .offline').show();
  // }
}
window.addEventListener('load', ()=>{
  hasNetworkFx('load', navigator.onLine);
});
window.addEventListener('online', ()=>{
  hasNetworkFx('online', navigator.onLine);
});
window.addEventListener('offline', ()=>{
  hasNetworkFx('offline', navigator.onLine);
});


function updateToolbar(item, status){
  if(status){
    $("#toolbar ." + item).show();
    if(item == "refresh"){
      $("#toolbar .refresh").addClass("spin");
    }
  } else{
    $("#toolbar ." + item).hide();
    if(item == "refresh"){
      $("#toolbar .refresh").removeClass("spin");
    }
    else if(item == "client"){
      $("#toolbar .client .tooltip").html("");
    }
  }
}

// function setOnlineStatus(status){
//   console.warn("setOnlineStatus ", !status);
//   updateToolbar("offline", !status);
// }

function getRandomToken(){
  var token = '';
  do{
    var ascicode=Math.floor((Math.random()*22)+48);
    if(ascicode<58 || ascicode>64){
      token+=String.fromCharCode(ascicode);
    }
  } 
  while(token.length<12);
  return token.toLowerCase();
}

function resolveBlobURL(id){
  mediaSrc = "";
  for(var i=0; i<blobURLs.length; i++){
    if(blobURLs[i].id == id){
      mediaSrc = blobURLs[i].src;
      break;
    }
  }
  return mediaSrc;
}

function parseJSON(data){
  if(typeof data === 'string'){
    return JSON.parse(data);
  }
  else{
    return data;
  }
}


function convertBoolean(str){
  if(str){
    if(typeof str == "string"){
      if(str == "1" || str.toLowerCase() == "true" || str.toLowerCase() == "yes" || str.toLowerCase() == "on"){
        return true;
      }
      else{
        return false;
      }
    }
    else if(str == 1 || str == true) {
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
}


function getScreenSize(){
  console.warn("getScreenSize");
  try{
    if(window.innerHeight){
      screenH = window.innerHeight;
    } else{
      screenH = 1080;
    }
    if(window.innerWidth){
      screenW = window.innerWidth;
    } else{
      screenW = 1920;
    }
  }
  catch(err){}
  
  $(".fsContainer").css({"width":screenW + "px", "height":screenH + "px"});
  ssW = parseInt(screenW/4);
  ssH = parseInt(screenH/4);
  if(screenH >= screenW){
    $("#waiting").css({"margin-left":((screenW - 357) / 2) + "px", "margin-top":((screenH - 677) / 2) -20 + "px", "visibility":"visible"});
    $("#waiting").html('<div class="wtQuad"><p style="margin-bottom:20px;width:357px">Waiting for Content</p><div><img src="./img/bg-p.png"></div></div>');
  }
  else{
    $("#waiting").css({"margin-left":((screenW - 952) / 2) + "px", "margin-top":((screenH - 224) / 2) -20 + "px", "visibility":"visible"});
    $("#waiting").html('<div class="wtQuad"><div><img src="./img/bg.png"></div><p style="margin-top:20px">Waiting for Content</p></div>');
  }
  waitingTxtFx();
}
setTimeout(() => {
  getScreenSize();
}, 100);

function waitingTxtFx(){
  console.warn("waitingTxtFx ", isWaiting);
  if(isWaiting){
    wtNum++;
    console.warn("wtNum ", wtNum);
    console.log(waitingArr.length);
    if(wtNum == waitingArr.length){
      wtNum = 0;
    }
    $("#waiting p").animate({"opacity":0}, 1300, function(){
      $(this).text(waitingArr[wtNum]);
    }).animate({"opacity":1}, 1300, function(){
      waitingTxtFx();
    });
  }
  else{
    $("#waiting p").empty();
  }
}