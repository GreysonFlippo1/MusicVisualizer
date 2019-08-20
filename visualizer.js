//Greyson Flippo 
//Ac130veterans@gmail.com
//GreysonFlippo@gmail.com
//created 6-6-2016 :)
//updated 8-14-2020
//https://chrome.google.com/webstore/detail/music-visualizer-for-goog/ofhohcappnjhojpboeamfijglinngdnb


//change vars to lets and consts, and organize them. There are more global variables throught the code
var showMenu = 0;
var addModImg = chrome.extension.getURL('add.png');

var site = "";
var uiDis = -1;
var bttnOffset = 0;
var uiColor = "#FF5722";
var sources = 0;
var artFill = 1;

var multiplier = 13;
var autoMultiplier = 0;
var fftUni = 16384;
//4096
//8192
//16384
//32768

var artSize = 1024;

setTimeout(loaded, 100);

function loaded() {

  //USE CONTAINS METHOD


  var url1 = window.location.href.substring(0, 24);

  //window.location.href.substring(0, 29)=="https://www.youtube.com/watch"

  //if(window.location.href.substring(0, 29) == "https://www.youtube.com/watch"){site="youtube";uiDis=-90;uiColor="#FF0000";}
  if (url1 == "https://www.youtube.com/") { site = "youtube"; uiDis = -90; uiColor = "#FF0000"; margB = 20; multiplier = 13; fftUni = 8192; bttnOffset = 60; }
  else if (url1 == "https://play.google.com/") { site = "playMusic"; multiplier = 13; }
  else if (url1 == "https://music.youtube.co") { site = "youtubeMusic"; multiplier = 11; uiColor = "#FF0000"; uiDis = -17; bttnOffset = 10; }
  else { site = "soundCloud"; multiplier = 13; }



  //CREATES MAIN BUTTON
  var bttn1 = document.createElement('img');
  document.body.appendChild(bttn1);
  bttn1.id = 'addModButton';
  document.getElementById('addModButton').src = addModImg;
  document.getElementById('addModButton').style.position = 'fixed';
  document.getElementById('addModButton').style.width = '60px';
  document.getElementById('addModButton').style.height = '60px';
  document.getElementById('addModButton').style.right = '40px';
  document.getElementById('addModButton').style.bottom = 110 + uiDis + bttnOffset + 'px';
  document.getElementById('addModButton').style.zIndex = '1600';
  document.getElementById('addModButton').style.borderRadius = "50%";
  document.getElementById('addModButton').style.backgroundColor = uiColor;
  document.getElementById('addModButton').style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)';
  document.getElementById('addModButton').style.cursor = 'pointer';
  document.getElementById('addModButton').addEventListener("click", showMods);

  var menu1 = document.createElement('div');
  document.body.appendChild(menu1);
  menu1.id = 'vizMenu';
  document.getElementById('vizMenu').style.position = 'fixed';
  document.getElementById('vizMenu').style.right = '-402px';
  document.getElementById('vizMenu').style.top = '64px';
  document.getElementById('vizMenu').style.width = '400px';
  document.getElementById('vizMenu').style.zIndex = '1599';
  document.getElementById('vizMenu').style.backgroundColor = '#ffffff';
  document.getElementById('vizMenu').style.borderLeft = '2px solid #eeeeee';
  document.getElementById('vizMenu').style.borderBottom = '1px solid #eeeeee';
  document.getElementById('vizMenu').style.height = window.innerHeight - 65 - 90 - uiDis + 'px';//another copy of this line when the menu opens
  document.getElementById('vizMenu').style.transition = 'right .5s';
  document.getElementById('vizMenu').style.overflowY = 'scroll';
  document.getElementById('vizMenu').style.overflowX = 'hidden';

  //items in the menu
  var menu1Title = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Title);
  menu1Title.id = 'menuTitle';
  document.getElementById('menuTitle').style.width = '360px';
  document.getElementById('menuTitle').style.padding = '20px';
  document.getElementById('menuTitle').style.fontSize = '40px';
  document.getElementById('menuTitle').style.marginTop = '10px';
  document.getElementById('menuTitle').style.fontFamily = 'sans-serif';
  document.getElementById('menuTitle').style.textAlign = 'center';
  document.getElementById('menuTitle').style.color = '#888888';
  document.getElementById('menuTitle').innerHTML = 'Visualizer Menu';

  var menu1Option1 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Option1);
  menu1Option1.id = 'Option1';
  document.getElementById('Option1').style.width = '360px';
  document.getElementById('Option1').style.padding = '50px';
  document.getElementById('Option1').style.fontSize = '23px';
  document.getElementById('Option1').style.marginTop = '-40px';
  document.getElementById('Option1').style.fontFamily = 'sans-serif';
  document.getElementById('Option1').style.textAlign = 'left';
  document.getElementById('Option1').style.color = '#aaaaaa';
  document.getElementById('Option1').innerHTML = 'Visualizer Type';

  var vizOption1 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(vizOption1);
  vizOption1.id = 'vizOption1';
  document.getElementById('vizOption1').style.width = '400px';
  document.getElementById('vizOption1').style.fontSize = '20px';
  document.getElementById('vizOption1').style.marginTop = '-30px';
  document.getElementById('vizOption1').style.marginBottom = 20 + 'px';
  document.getElementById('vizOption1').style.fontFamily = 'sans-serif';
  document.getElementById('vizOption1').style.textAlign = 'center';
  document.getElementById('vizOption1').style.color = uiColor;
  document.getElementById('vizOption1').style.cursor = 'pointer';
  document.getElementById('vizOption1').innerHTML = 'Off';
  document.getElementById('vizOption1').addEventListener("click", turnOff);

  var vizOption2 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(vizOption2);
  vizOption2.id = 'vizOption2';
  document.getElementById('vizOption2').style.width = '400px';
  document.getElementById('vizOption2').style.fontSize = '20px';
  document.getElementById('vizOption2').style.marginTop = '0px';
  document.getElementById('vizOption2').style.marginBottom = 20 + 'px';
  document.getElementById('vizOption2').style.fontFamily = 'sans-serif';
  document.getElementById('vizOption2').style.textAlign = 'center';
  document.getElementById('vizOption2').style.color = '#aaaaaa';
  document.getElementById('vizOption2').style.cursor = 'pointer';
  document.getElementById('vizOption2').style.zIndex = '12';
  document.getElementById('vizOption2').innerHTML = 'Bars';
  document.getElementById('vizOption2').addEventListener("click", showBarsV);

  var vizOption3 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(vizOption3);
  vizOption3.id = 'vizOption3';
  document.getElementById('vizOption3').style.width = '400px';
  document.getElementById('vizOption3').style.fontSize = '20px';
  document.getElementById('vizOption3').style.marginTop = '0px';
  document.getElementById('vizOption3').style.marginBottom = 20 + 'px';
  document.getElementById('vizOption3').style.fontFamily = 'sans-serif';
  document.getElementById('vizOption3').style.textAlign = 'center';
  document.getElementById('vizOption3').style.color = '#aaaaaa';
  document.getElementById('vizOption3').style.cursor = 'pointer';
  document.getElementById('vizOption3').innerHTML = 'Wave';
  document.getElementById('vizOption3').addEventListener("click", showWaveV);

  var vizOption4 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(vizOption4);
  vizOption4.id = 'vizOption4';
  document.getElementById('vizOption4').style.width = '400px';
  document.getElementById('vizOption4').style.fontSize = '20px';
  document.getElementById('vizOption4').style.marginTop = '0px';
  document.getElementById('vizOption4').style.marginBottom = 20 + 'px';
  document.getElementById('vizOption4').style.fontFamily = 'sans-serif';
  document.getElementById('vizOption4').style.textAlign = 'center';
  document.getElementById('vizOption4').style.color = '#aaaaaa';
  document.getElementById('vizOption4').style.cursor = 'pointer';
  document.getElementById('vizOption4').innerHTML = 'Ambiance';
  document.getElementById('vizOption4').addEventListener("click", showAmbienceV);

  var vizOption5 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(vizOption5);
  vizOption5.id = 'vizOption5';
  document.getElementById('vizOption5').style.width = '400px';
  document.getElementById('vizOption5').style.fontSize = '20px';
  document.getElementById('vizOption5').style.marginTop = '0px';
  document.getElementById('vizOption5').style.marginBottom = 20 + 'px';
  document.getElementById('vizOption5').style.fontFamily = 'sans-serif';
  document.getElementById('vizOption5').style.textAlign = 'center';
  document.getElementById('vizOption5').style.color = '#aaaaaa';
  document.getElementById('vizOption5').style.cursor = 'pointer';
  document.getElementById('vizOption5').innerHTML = 'Ring';
  document.getElementById('vizOption5').addEventListener("click", showRingV);

  var menu1Tip = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Tip);
  menu1Tip.id = 'menu1Tip';
  document.getElementById('menu1Tip').style.width = '300px';
  document.getElementById('menu1Tip').style.padding = '50px';
  document.getElementById('menu1Tip').style.fontSize = '15px';
  document.getElementById('menu1Tip').style.marginTop = '-50px';
  document.getElementById('menu1Tip').style.fontFamily = 'sans-serif';
  document.getElementById('menu1Tip').style.textAlign = 'left';
  document.getElementById('menu1Tip').style.color = '#aaaaaa';
  document.getElementById('menu1Tip').innerHTML = "*tip - press the ESC key on your keyboard to cycle through visualizer types at any time and to reappear the '+' button if it is temporarily hidden. ";


  var menu1Option2 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Option2);
  menu1Option2.id = 'Option2';
  document.getElementById('Option2').style.width = '360px';
  document.getElementById('Option2').style.padding = '50px';
  document.getElementById('Option2').style.fontSize = '23px';
  document.getElementById('Option2').style.marginTop = '-40px';
  document.getElementById('Option2').style.fontFamily = 'sans-serif';
  document.getElementById('Option2').style.textAlign = 'left';
  document.getElementById('Option2').style.color = '#aaaaaa';
  document.getElementById('Option2').innerHTML = 'Height Multiplier';

  var multN = document.createElement('p');
  document.getElementById('vizMenu').appendChild(multN);
  multN.id = 'multN';
  document.getElementById('multN').style.width = '400px';
  document.getElementById('multN').style.fontSize = '20px';
  document.getElementById('multN').style.marginTop = '-30px';
  document.getElementById('multN').style.marginBottom = 20 + 'px';
  document.getElementById('multN').style.fontFamily = 'sans-serif';
  document.getElementById('multN').style.textAlign = 'center';
  document.getElementById('multN').style.color = uiColor;
  document.getElementById('multN').innerHTML = multiplier / 10;

  var multM = document.createElement('p');
  document.getElementById('vizMenu').appendChild(multM);
  multM.id = 'multM';
  document.getElementById('multM').style.width = '100px';
  document.getElementById('multM').style.fontSize = '20px';
  document.getElementById('multM').style.marginTop = '-44px';
  document.getElementById('multM').style.marginLeft = '100px';
  document.getElementById('multM').style.marginBottom = 20 + 'px';
  document.getElementById('multM').style.fontFamily = 'sans-serif';
  document.getElementById('multM').style.textAlign = 'center';
  document.getElementById('multM').style.color = '#aaaaaa';
  document.getElementById('multM').style.cursor = 'pointer';
  document.getElementById('multM').innerHTML = "&#8592;";
  document.getElementById('multM').addEventListener("click", multiplierM);

  var multP = document.createElement('p');
  document.getElementById('vizMenu').appendChild(multP);
  multP.id = 'multP';
  document.getElementById('multP').style.width = '100px';
  document.getElementById('multP').style.fontSize = '20px';
  document.getElementById('multP').style.marginTop = '-42px';
  document.getElementById('multP').style.marginLeft = '200px';
  document.getElementById('multP').style.marginBottom = 20 + 'px';
  document.getElementById('multP').style.fontFamily = 'sans-serif';
  document.getElementById('multP').style.textAlign = 'center';
  document.getElementById('multP').style.color = '#aaaaaa';
  document.getElementById('multP').style.cursor = 'pointer';
  document.getElementById('multP').innerHTML = "&#8594;";
  document.getElementById('multP').addEventListener("click", multiplierP);

  var multA = document.createElement('p');
  document.getElementById('vizMenu').appendChild(multA);
  multA.id = 'multA';
  document.getElementById('multA').style.width = '400px';
  document.getElementById('multA').style.fontSize = '20px';
  document.getElementById('multA').style.marginTop = '0px';
  document.getElementById('multA').style.marginBottom = 50 + 'px';
  document.getElementById('multA').style.fontFamily = 'sans-serif';
  document.getElementById('multA').style.textAlign = 'center';
  document.getElementById('multA').style.color = '#aaaaaa';
  document.getElementById('multA').innerHTML = "Auto Multiply";
  document.getElementById('multA').style.cursor = 'pointer';
  document.getElementById('multA').addEventListener("click", multiplierA);


  var menu1Option3 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Option3);
  menu1Option3.id = 'Option3';
  document.getElementById('Option3').style.width = '360px';
  document.getElementById('Option3').style.padding = '50px';
  document.getElementById('Option3').style.fontSize = '23px';
  document.getElementById('Option3').style.marginTop = '-40px';
  document.getElementById('Option3').style.marginBottom = '-10px';
  document.getElementById('Option3').style.fontFamily = 'sans-serif';
  document.getElementById('Option3').style.textAlign = 'left';
  document.getElementById('Option3').style.color = '#aaaaaa';
  document.getElementById('Option3').innerHTML = 'Album Art Mode';

  var artToggle = document.createElement('p');
  document.getElementById('vizMenu').appendChild(artToggle);
  artToggle.id = 'artToggle';
  document.getElementById('artToggle').style.width = '400px';
  document.getElementById('artToggle').style.fontSize = '20px';
  document.getElementById('artToggle').style.marginTop = '0px';
  document.getElementById('artToggle').style.marginBottom = 50 + 'px';
  document.getElementById('artToggle').style.fontFamily = 'sans-serif';
  document.getElementById('artToggle').style.textAlign = 'center';
  document.getElementById('artToggle').style.color = '#aaaaaa';
  document.getElementById('artToggle').style.cursor = 'pointer';
  document.getElementById('artToggle').innerHTML = "Toggle On/Off";
  document.getElementById('artToggle').addEventListener("click", artWallpaper);

  var artRes = document.createElement('p');
  document.getElementById('vizMenu').appendChild(artRes);
  artRes.id = 'artRes';
  document.getElementById('artRes').style.width = '400px';
  document.getElementById('artRes').style.fontSize = '20px';
  document.getElementById('artRes').style.marginTop = '-25px';
  document.getElementById('artRes').style.marginBottom = 50 + 'px';
  document.getElementById('artRes').style.fontFamily = 'sans-serif';
  document.getElementById('artRes').style.textAlign = 'center';
  document.getElementById('artRes').style.color = '#aaaaaa';
  document.getElementById('artRes').style.cursor = 'pointer';
  document.getElementById('artRes').innerHTML = "Even Higher Resolution";
  document.getElementById('artRes').addEventListener("click", changeResolution);

  var artFill = document.createElement('p');
  document.getElementById('vizMenu').appendChild(artFill);
  artFill.id = 'artFill';
  document.getElementById('artFill').style.width = '400px';
  document.getElementById('artFill').style.fontSize = '20px';
  document.getElementById('artFill').style.marginTop = '-25px';
  document.getElementById('artFill').style.marginBottom = 50 + 'px';
  document.getElementById('artFill').style.fontFamily = 'sans-serif';
  document.getElementById('artFill').style.textAlign = 'center';
  document.getElementById('artFill').style.color = uiColor;
  document.getElementById('artFill').style.cursor = 'pointer';
  document.getElementById('artFill').innerHTML = "Art Clipping";
  document.getElementById('artFill').addEventListener("click", changeArtFill);

  var menu1Option4 = document.createElement('p');
  document.getElementById('vizMenu').appendChild(menu1Option4);
  menu1Option4.id = 'Option4';
  document.getElementById('Option4').style.width = '360px';
  document.getElementById('Option4').style.padding = '50px';
  document.getElementById('Option4').style.fontSize = '23px';
  document.getElementById('Option4').style.marginTop = '-40px';
  document.getElementById('Option4').style.marginBottom = '-10px';
  document.getElementById('Option4').style.fontFamily = 'sans-serif';
  document.getElementById('Option4').style.textAlign = 'left';
  document.getElementById('Option4').style.color = '#aaaaaa';
  document.getElementById('Option4').innerHTML = 'Additional Options';

  var bttnToggle = document.createElement('p');
  document.getElementById('vizMenu').appendChild(bttnToggle);
  bttnToggle.id = 'bttnToggle';
  document.getElementById('bttnToggle').style.width = '400px';
  document.getElementById('bttnToggle').style.fontSize = '20px';
  document.getElementById('bttnToggle').style.marginTop = '0px';
  document.getElementById('bttnToggle').style.marginBottom = 20 + 'px';
  document.getElementById('bttnToggle').style.fontFamily = 'sans-serif';
  document.getElementById('bttnToggle').style.textAlign = 'center';
  document.getElementById('bttnToggle').style.color = '#aaaaaa';
  document.getElementById('bttnToggle').style.cursor = 'pointer';
  document.getElementById('bttnToggle').innerHTML = "Hide '+' Button";
  document.getElementById('bttnToggle').addEventListener("click", hideUI);

  var colorCycleToggle = document.createElement('p');
  document.getElementById('vizMenu').appendChild(colorCycleToggle);
  colorCycleToggle.id = 'colorCycleToggle';
  document.getElementById('colorCycleToggle').style.width = '400px';
  document.getElementById('colorCycleToggle').style.fontSize = '20px';
  document.getElementById('colorCycleToggle').style.marginTop = '0px';
  document.getElementById('colorCycleToggle').style.marginBottom = 50 + 'px';
  document.getElementById('colorCycleToggle').style.fontFamily = 'sans-serif';
  document.getElementById('colorCycleToggle').style.textAlign = 'center';
  document.getElementById('colorCycleToggle').style.color = uiColor;
  document.getElementById('colorCycleToggle').style.cursor = 'pointer';
  document.getElementById('colorCycleToggle').innerHTML = "Waveform Color Cycle";
  document.getElementById('colorCycleToggle').addEventListener("click", stopColorCycle);

  if (site == "youtube" || site == "youtubeMusic") {
    document.getElementById('Option3').style.display = "none";
    document.getElementById('artToggle').style.display = "none";
    document.getElementById('artRes').style.display = "none";
  }

}



function showMods() {
  document.getElementById('addModButton').style.width = '56px';
  document.getElementById('addModButton').style.height = '56px';
  document.getElementById('addModButton').style.right = '42px';
  document.getElementById('addModButton').style.bottom = 112 + uiDis + bttnOffset + 'px';
  document.getElementById('addModButton').style.boxShadow = '0 3px 6px rgba(0,0,0,0.4)';
  setTimeout(function () { document.getElementById('addModButton').style.width = '60px'; document.getElementById('addModButton').style.height = '60px'; document.getElementById('addModButton').style.right = '40px'; document.getElementById('addModButton').style.bottom = 110 + uiDis + bttnOffset + 'px'; document.getElementById('addModButton').style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)'; }, 100);

  if (showMenu == 0) {
    showMenu = 1;
    document.getElementById('vizMenu').style.height = window.innerHeight - 65 - 90 - uiDis + 'px';//another copy above when the menu is made
    document.getElementById('vizMenu').style.right = '0px';
  }

  else {
    showMenu = 0;
    document.getElementById('vizMenu').style.right = '-402px';
  }

}

var barWidth = 12;
var barAmnt = 0;
var vizReady = 0;
var barSpacing = 2;


var vizInit = 0;
var vizShow = 0;

var tempWid = window.innerHeight;

function showViz() {
  if (vizShow == 0) //literally nothing initialized to bars 
  {
    getAudioId();
    vizShow = 1;
  }

  else if (vizShow == 1) // bars to wave
  {
    for (i = 0; i < barAmnt; i++) {
      document.getElementById('bar' + i).style.display = 'none';
      vizShow = 2;
    }
    document.getElementById('ambience1').style.display = 'none';
    document.getElementById('canvas1').style.display = 'block';
    document.getElementById('vizOption1').style.color = '#aaaaaa';
    document.getElementById('vizOption2').style.color = '#aaaaaa';
    document.getElementById('vizOption3').style.color = uiColor;
    document.getElementById('vizOption4').style.color = '#aaaaaa';
    document.getElementById('vizOption5').style.color = '#aaaaaa';
    if (wallpaper == 1) {
      artWallpaper();
    }
  }

  else if (vizShow == 2) //wave to ambience
  {
    for (i = 0; i < barAmnt; i++) {
      document.getElementById('bar' + i).style.display = 'none';
    }
    document.getElementById('canvas1').style.display = 'none';
    document.getElementById('vizOption1').style.color = '#aaaaaa';
    document.getElementById('vizOption2').style.color = '#aaaaaa';
    document.getElementById('vizOption3').style.color = '#aaaaaa';
    document.getElementById('vizOption4').style.color = uiColor;
    document.getElementById('vizOption5').style.color = '#aaaaaa';
    document.getElementById('ambience1').style.display = 'block';
    vizShow = 3;
  }


  else if (vizShow == 3) //ambience to ring
  {
    for (i = 0; i < barAmnt; i++) {
      document.getElementById('bar' + i).style.display = 'none';
    }
    document.getElementById('canvas1').style.display = 'block';
    document.getElementById('ambience1').style.display = 'none';
    document.getElementById('vizOption1').style.color = "#aaaaaa";
    document.getElementById('vizOption2').style.color = '#aaaaaa';
    document.getElementById('vizOption3').style.color = '#aaaaaa';
    document.getElementById('vizOption4').style.color = '#aaaaaa';
    document.getElementById('vizOption5').style.color = uiColor;
    vizShow = 4;
  }

  else if (vizShow == 4) //ring to off
  {
    for (i = 0; i < barAmnt; i++) {
      document.getElementById('bar' + i).style.display = 'none';
    }
    document.getElementById('canvas1').style.display = 'none';
    document.getElementById('ambience1').style.display = 'none';
    document.getElementById('vizOption1').style.color = uiColor;
    document.getElementById('vizOption2').style.color = '#aaaaaa';
    document.getElementById('vizOption3').style.color = '#aaaaaa';
    document.getElementById('vizOption4').style.color = '#aaaaaa';
    document.getElementById('vizOption5').style.color = '#aaaaaa';
    vizShow = 5;
  }

  else if (vizShow == 5) //off to bars
  {
    document.getElementById('ambience1').style.display = 'none';
    document.getElementById('canvas1').style.display = 'none';
    for (i = 0; i < barAmnt; i++) {
      document.getElementById('bar' + i).style.display = 'block';
      vizShow = 1;
    }
    document.getElementById('vizOption1').style.color = '#aaaaaa';
    document.getElementById('vizOption2').style.color = uiColor;
    document.getElementById('vizOption3').style.color = '#aaaaaa';
    document.getElementById('vizOption4').style.color = '#aaaaaa';
    document.getElementById('vizOption5').style.color = '#aaaaaa';
  }
}



function turnOff() {
  if (vizShow == 0) {
    getAudioId();
  }
  vizShow = 4;
  showViz();
  if (wallpaper == 1) {
    artWallpaper();
  }
}

function showBarsV() {
  if (vizShow == 0) {
    getAudioId();
  }
  vizShow = 5;
  showViz();
}

function showWaveV() {
  if (vizShow == 0) {
    getAudioId();
  }
  vizShow = 1;
  showViz();
}

function showAmbienceV() {
  if (vizShow == 0) {
    getAudioId();
  }
  vizShow = 2;
  showViz();
}

function showRingV() {
  if (vizShow == 0) {
    getAudioId();
  }
  vizShow = 3;
  showViz();
}


function getAudioId() {

  //gives audio tag an id to work with
  if (site == "playMusic") {
    setAlbumArtClick();
    sources = document.getElementsByTagName('audio').length;
    //console.log(sources + "audio sources detected");
    for (i = 0; i < sources; i++) {
      document.body.getElementsByTagName('audio')[i].id = "audioSource" + i;
    }
  }
  else if (site == "youtube") { document.body.getElementsByTagName('video')[0].id = "audioSource0"; sources = 1; }
  else if (site == "youtubeMusic") { document.body.getElementsByClassName('video-stream html5-main-video')[0].id = "audioSource0"; sources = 1; }
  else { document.body.getElementsByTagName('audio')[0].id = "audioSource0"; }

  createAudioSource(sources);


  //creates canvas
  var can1 = document.createElement('canvas');
  can1.setAttribute("id", "canvas1");
  document.body.appendChild(can1);
  document.getElementById('canvas1').style.zIndex = '1502';
  document.getElementById('canvas1').style.position = 'fixed';
  document.getElementById('canvas1').style.top = '0px';
  document.getElementById('canvas1').style.left = '0px';
  document.getElementById('canvas1').setAttribute('width', window.innerWidth);
  document.getElementById('canvas1').setAttribute('height', window.innerHeight - 90 - uiDis);
  document.getElementById('canvas1').style.display = "none";
  document.getElementById('canvas1').style.backgroundColor = "rgba(0,0,0,1)";

  //creates ambience cover and it's assets
  var ambience1 = document.createElement('div');
  ambience1.setAttribute("id", "ambience1");
  document.body.appendChild(ambience1);
  document.getElementById('ambience1').style.zIndex = '1502';
  document.getElementById('ambience1').style.position = 'fixed';
  document.getElementById('ambience1').style.top = '0px';
  document.getElementById('ambience1').style.left = '0px';
  document.getElementById('ambience1').style.width = window.innerWidth + "px";
  document.getElementById('ambience1').style.height = window.innerHeight - uiDis + "px";
  document.getElementById('ambience1').style.display = "none";
  document.getElementById('ambience1').style.backgroundColor = "#000000";

  var topGlow = document.createElement('div');
  topGlow.setAttribute("id", "topGlow");
  document.getElementById('ambience1').appendChild(topGlow);
  document.getElementById('topGlow').style.position = 'absolute';
  document.getElementById('topGlow').style.zIndex = '2';
  document.getElementById('topGlow').style.top = '-300px';
  document.getElementById('topGlow').style.left = '0px';
  document.getElementById('topGlow').style.width = '100%';
  document.getElementById('topGlow').style.height = '0px';

  var bottomGlow = document.createElement('div');
  bottomGlow.setAttribute("id", "bottomGlow");
  document.getElementById('ambience1').appendChild(bottomGlow);
  document.getElementById('bottomGlow').style.position = 'absolute';
  document.getElementById('bottomGlow').style.zIndex = '2';
  document.getElementById('bottomGlow').style.bottom = '-300px';
  document.getElementById('bottomGlow').style.left = '0px';
  document.getElementById('bottomGlow').style.width = '100%';
  document.getElementById('bottomGlow').style.height = '0px';

  var leftGlow = document.createElement('div');
  leftGlow.setAttribute("id", "leftGlow");
  document.getElementById('ambience1').appendChild(leftGlow);
  document.getElementById('leftGlow').style.position = 'absolute';
  document.getElementById('leftGlow').style.zIndex = '2';
  document.getElementById('leftGlow').style.top = '0px';
  document.getElementById('leftGlow').style.left = '-300px';
  document.getElementById('leftGlow').style.width = '0px';
  document.getElementById('leftGlow').style.height = '100%';

  var rightGlow = document.createElement('div');
  rightGlow.setAttribute("id", "rightGlow");
  document.getElementById('ambience1').appendChild(rightGlow);
  document.getElementById('rightGlow').style.position = 'absolute';
  document.getElementById('rightGlow').style.zIndex = '2';
  document.getElementById('rightGlow').style.top = '0px';
  document.getElementById('rightGlow').style.right = '-300px';
  document.getElementById('rightGlow').style.width = '0px';
  document.getElementById('rightGlow').style.height = '100%';


  //creates the visualizer bars
  tempWid = window.innerWidth;
  drawBars();


  vizReady = barAmnt;


  barVis();
  waveVis();
}

var audioCtx0;
var audio0;
var source0;
var analyser0;
var frequencyData0;

var audioCtx1;
var audio1;
var source1;
var analyser1;
var frequencyData1;

var audioCtx2;
var audio2;
var source2;
var analyser2;
var frequencyData2;

var audioCtx3;
var audio3;
var source3;
var analyser3;
var frequencyData3;

var audioCtx4;
var audio4;
var source4;
var analyser4;
var frequencyData4;

var start = 0;
function createAudioSource(num) {
  for (i = start; i < num; i++) {
    eval("audioCtx" + i + " = new AudioContext();analyser" + i + " = audioCtx" + i + ".createAnalyser();analyser" + i + ".smoothingTimeConstant = .55;audio" + i + " = document.getElementById('audioSource'+" + i + ");source" + i + " =  audioCtx" + i + ".createMediaElementSource(audio" + i + ");source" + i + ".connect(analyser" + i + ");analyser" + i + ".connect(audioCtx" + i + ".destination);analyser" + i + ".fftSize = " + fftUni + ";frequencyData" + i + " = new Uint8Array(analyser" + i + ".frequencyBinCount);bufferLength" + i + " = analyser" + i + ".frequencyBinCount;dataArray" + i + " = new Uint8Array(bufferLength" + i + ");");
    start++;
  }
  getActiveSource();
}

var currentSource = 0;
function getActiveSource() {
  if (site == "youtubeMusic") { document.body.getElementsByClassName('video-stream html5-main-video')[0].id = "audioSource0"; }
  for (i = 0; i < sources; i++) {
    eval("analyser" + i + ".getByteFrequencyData(frequencyData" + i + ")");
    if (eval("frequencyData" + i + "[50]") + eval("frequencyData" + i + "[55]") != 0) {
      currentSource = i;
      document.getElementById("audioSource" + i).playbackRate = 1;
    }
  }
  //console.log(currentSource+"Current Source");
  //setTimeout(getActiveSource,200);
}



var c;
var barColor;
var img1;


//uses the data to change the height of the bars




function barVis() //bar viz and ambient viz 
{
  eval("analyser" + currentSource + ".getByteFrequencyData(frequencyData" + currentSource + ")");
  var freqData = eval("frequencyData" + currentSource);

  var j = 0;
  var avg = 0;
  var offset = 16;
  var last = -1;

  for (j = 0; j < barAmnt; j++) {
    if (vizReady == barAmnt) {
      var smooth = 0;
      var formula = Math.ceil(Math.pow(j, 1.2));
      var pop;
      pop = (freqData[formula]) * (freqData[formula]) * (freqData[formula] / 3) / (255 * 255 * (255 / 3)) * ((window.innerHeight - 100) * .30) * multiplier / 10;

      if (last != -1) {
        smooth = pop + last / 2;
      }
      else {
        smooth = pop;
      }
      last = pop;
      avg += pop;
      document.getElementById('bar' + j).style.height = smooth + 'px';
    }
  }
  avg = avg / barAmnt;

  vizInit = 1;

  if (avg == 0) {
    getActiveSource();
  }

  else if (avg < window.innerHeight * 0.2 && autoMultiplier == 1) {
    multiplierP2();
  }

  else if (autoMultiplier == 1) {
    multiplierM2();
  }

  if (window.innerWidth != tempWid) {
    drawBars();
    tempWid = window.innerWidth;
  }


  if (vizShow == 3) {
    document.getElementById('ambience1').style.width = window.innerWidth + "px";
    document.getElementById('ambience1').style.height = window.innerHeight - uiDis + "px";
    document.getElementById("ambience1").style.boxShadow = "inset 0px 0px 500px rgba(255,255,255," + freqData[2] / 255 + ")";
    document.getElementById("topGlow").style.boxShadow = "0px 0px 500px 500px rgba(50,50,255," + (freqData[8] * freqData[8]) / (255 * 255) + ")";
    document.getElementById("bottomGlow").style.boxShadow = "0px 0px 500px 500px rgba(255,50,50," + (freqData[40] * freqData[40]) / (255 * 255) + ")";
    document.getElementById("leftGlow").style.boxShadow = "0px 0px 500px 500px rgba(50,255,50," + (freqData[160] * freqData[160]) / (255 * 255) + ")";
    document.getElementById("rightGlow").style.boxShadow = "0px 0px 500px 500px rgba(255,255,50," + (freqData[500] * freqData[500]) / (255 * 255) + ")";
  }

  setTimeout(barVis, 1);
}


var colorCycle = 1;
function stopColorCycle() {
  if (colorCycle == 1) {
    document.getElementById("colorCycleToggle").style.color = "#aaaaaa";
    colorCycle = 0;
  }
  else {
    document.getElementById("colorCycleToggle").style.color = uiColor;
    colorCycle = 1;
  }
}



var red = 255;
var green = 0;
var blue = 0;



function waveVis() {
  var c = document.getElementById('canvas1');
  var canvasCtx = c.getContext("2d");
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight - 90 - uiDis;


  function draw() {
    if (site == "youtube") { document.getElementById("content").onload = function () { console.log("updating visualizer"); } }
    if (red == 255 && colorCycle == 1) {
      if (blue > 0) { blue--; }
      else { green++ }
    }

    if (green == 255 && colorCycle == 1) {
      if (red > 0) { red--; }
      else { blue++ }
    }

    if (blue == 255 && colorCycle == 1) {
      if (green > 0) { green--; }
      else { red++; }
    }

    WIDTH = window.innerWidth;
    HEIGHT = (window.innerHeight - 90 - uiDis);
    drawVisual = setTimeout(function () { requestAnimationFrame(draw) }, 1);
    eval("analyser" + currentSource + ".getByteTimeDomainData(dataArray" + currentSource + ")");
    canvasCtx.width = WIDTH;
    canvasCtx.height = HEIGHT;
    document.getElementById('canvas1').setAttribute('width', window.innerWidth);
    document.getElementById('canvas1').setAttribute('height', window.innerHeight - 90 - uiDis);
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    canvasCtx.lineWidth = 1.3;
    if (vizShow == 4) { canvasCtx.lineWidth = 3; }
    canvasCtx.beginPath();
    var sliceWidth = 1;
    var radius1 = HEIGHT / 2 - 300;
    var x = 0;
    var lastx = WIDTH / 2 + radius1;
    var lasty = HEIGHT / 2;
    var x = 0;

    for (var i = 0; i < bufferLength0; i++) {
      var v = eval("dataArray" + currentSource + "[i]") / 128.0;
      var radius2 = radius1 + (v * v * 150);
      var y = v * HEIGHT / 2;
      if (vizShow == 4) {
        if (i === 0) {
          canvasCtx.moveTo((WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / bufferLength0), (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / bufferLength0) * -1);
        }
        else {
          canvasCtx.lineTo((WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / bufferLength0), (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / bufferLength0) * -1);
        }
      }
      else {
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        }
        else {
          canvasCtx.lineTo(x, y);
        }
      }
      lastx = (WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / bufferLength0);
      lasty = (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / bufferLength0) * -1;
      x += sliceWidth;
    }
    if (vizShow == 4) { canvasCtx.lineTo(lastx, lasty); }
    else { canvasCtx.lineTo(window.innerWidth, window.innerHeight / 2); }
    canvasCtx.stroke();
    setTimeout(function () { canvasCtx.clearRect(0, 0, WIDTH, HEIGHT); }, 1);
  }
  draw();
}



function drawBars() {
  var barAmntTemp = 0;
  for (i = 0; i < window.innerWidth + barSpacing + (barWidth / 2); i += (barWidth + barSpacing)) { barAmntTemp++; }
  if (barAmntTemp > barAmnt) {
    for (var i = 0; i < barAmntTemp; i++) {
      if (barAmntTemp > barAmnt) {
        var bars = document.createElement('div');
        bars.setAttribute("id", "bar" + i);
        document.body.appendChild(bars);
      }
      document.getElementById('bar' + i).style.width = barWidth + 'px';
      document.getElementById('bar' + i).style.position = 'fixed';
      document.getElementById('bar' + i).style.left = (barWidth + barSpacing) * (i - 1) + 'px';
      document.getElementById('bar' + i).style.bottom = 90 + uiDis + 'px';
      document.getElementById('bar' + i).style.backgroundColor = uiColor;
      document.getElementById('bar' + i).style.zIndex = '1502';
      document.getElementById('bar' + i).style.opacity = '.8';
      if (vizShow == 2 || vizShow == 3 || vizShow == 4) { document.getElementById('bar' + i).style.display = 'none'; }
    }
  }

  else {
    for (var i = barAmntTemp; i < barAmnt; i++) {
      document.getElementById('bar' + i).remove();
    }
  }

  barAmnt = barAmntTemp;
  vizReady = barAmnt;
  //console.log(barAmnt+"bars drawn");
}


function multiplierP() {
  if (autoMultiplier == 1) {
    autoMultiplier = 0;
    document.getElementById('multA').style.color = '#aaaaaa';
    document.getElementById('multN').style.color = uiColor;
    multiplier = 13;
  }

  if (multiplier < 20) {
    multiplier += 1;
    document.getElementById('multN').innerHTML = multiplier / 10;
  }
}

function multiplierM() {
  if (autoMultiplier == 1) {
    autoMultiplier = 0;
    document.getElementById('multA').style.color = '#aaaaaa';
    document.getElementById('multN').style.color = uiColor;
    multiplier = 13;
  }

  if (multiplier > 1) {
    multiplier -= 1;
    document.getElementById('multN').innerHTML = multiplier / 10;
  }
}


function multiplierP2() {
  if (multiplier < 16) {
    multiplier += .2;
  }
}

function multiplierM2() {
  if (multiplier > 1) {
    multiplier -= .2;
  }
}

function multiplierA() {
  if (autoMultiplier == 0) {
    autoMultiplier = 1;
    document.getElementById('multA').style.color = uiColor;
    document.getElementById('multN').style.color = '#aaaaaa';
    multiplier = 13;
  }
  else {
    autoMultiplier = 0;
    document.getElementById('multA').style.color = '#aaaaaa';
    document.getElementById('multN').style.color = uiColor;
    multiplier = 13;
  }
}


function setAlbumArtClick() {
  document.getElementById("playerBarArt").addEventListener("click", artWallpaper);
  document.getElementById("playerBarArt").style.cursor = 'pointer';
  document.getElementById("playerBarArt").style.zIndex = '1000';
  setTimeout(setAlbumArtClick, 1000);
}


var wall1 = document.createElement('div');
wall1.setAttribute("id", "wallpaper1");
document.body.appendChild(wall1);
document.getElementById('wallpaper1').style.zIndex = '1499';
document.getElementById('wallpaper1').style.position = 'fixed';
document.getElementById('wallpaper1').style.top = '0px';
document.getElementById('wallpaper1').style.left = '0px';
document.getElementById('wallpaper1').style.width = window.innerWidth + "px";
document.getElementById('wallpaper1').style.height = (window.innerHeight - 90 - uiDis) + "px";
document.getElementById('wallpaper1').style.display = "none";
document.getElementById('wallpaper1').style.transition = "opacity .5s";
document.getElementById('wallpaper1').style.opacity = 0;
document.getElementById('wallpaper1').style.backgroundColor = "rgba(0,0,0,0)";

var wall2 = document.createElement('canvas');
wall2.setAttribute("id", "wallpaper2");
document.body.appendChild(wall2);
document.getElementById('wallpaper2').style.zIndex = '1498';
document.getElementById('wallpaper2').style.position = 'fixed';
document.getElementById('wallpaper2').style.top = '0px';
document.getElementById('wallpaper2').style.left = '0px';
document.getElementById('wallpaper2').style.width = window.innerWidth + "px";
document.getElementById('wallpaper2').style.height = (window.innerHeight - 90 - uiDis) + "px";
document.getElementById('wallpaper2').style.display = "none";
document.getElementById('wallpaper2').style.transition = "opacity .5s";
document.getElementById('wallpaper2').style.opacity = 1;
document.getElementById('wallpaper2').style.backgroundColor = "#000000";
document.getElementById('wallpaper2').setAttribute('width', 1);
document.getElementById('wallpaper2').setAttribute('height', 1);


var wtitle1 = document.createElement('p');
wtitle1.setAttribute("id", "wtitle1");
document.body.appendChild(wtitle1);
document.getElementById('wtitle1').style.zIndex = '1500';
document.getElementById('wtitle1').style.position = 'fixed';
document.getElementById('wtitle1').style.top = '20px';
document.getElementById('wtitle1').style.left = '100px';
document.getElementById('wtitle1').style.color = "#ffffff";
document.getElementById('wtitle1').style.fontSize = "90px";
document.getElementById('wtitle1').style.fontFamily = "sans-serif";
document.getElementById('wtitle1').style.display = "none";
document.getElementById('wtitle1').style.transition = "opacity .5s";
document.getElementById('wtitle1').style.opacity = 0;
document.getElementById('wtitle1').style.whiteSpace = "nowrap";
document.getElementById('wtitle1').style.textOverflow = "ellipsis";
document.getElementById('wtitle1').style.overflow = "hidden";
document.getElementById('wtitle1').style.width = window.innerWidth - 150 + "px";
document.getElementById('wtitle1').innerHTML = "";


var wtitle2 = document.createElement('p');
wtitle2.setAttribute("id", "wtitle2");
document.body.appendChild(wtitle2);
document.getElementById('wtitle2').style.zIndex = '1500';
document.getElementById('wtitle2').style.position = 'fixed';
document.getElementById('wtitle2').style.top = '180px';
document.getElementById('wtitle2').style.left = '100px';
document.getElementById('wtitle2').style.color = "#ffffff";
document.getElementById('wtitle2').style.fontSize = "30px";
document.getElementById('wtitle2').style.fontFamily = "sans-serif";
document.getElementById('wtitle2').style.display = "none";
document.getElementById('wtitle2').style.transition = "opacity .5s";
document.getElementById('wtitle2').style.opacity = 0;
document.getElementById('wtitle2').innerHTML = "";

var wallpaper = 0;
var artInterval = null;
var artBlur = 5;

function artWallpaper() {

  if (sources == 0) {
    getAudioId();
  }
  if (wallpaper == 0) {
    document.getElementById('artToggle').style.color = uiColor;
    wallpaper = 1;
    // A special thanks to <ababypenguin@gmail.com> for figuring out how to fetch larger album art
    var src1 = document.getElementById("playerBarArt").src;
    var indexOfEquals = src1.indexOf("=");
    src1 = src1.substring(0, indexOfEquals) + "=s" + artSize + "-c-e100";
    document.getElementById('wallpaper1').style.width = window.innerWidth + "px";
    document.getElementById('wallpaper1').style.height = window.innerHeight - 90 - uiDis + "px";
    document.getElementById('wallpaper1').style.display = "block";
    document.getElementById('wtitle1').style.display = "block";
    document.getElementById('wtitle2').style.display = "block";
    document.getElementById('wallpaper1').style.backgroundImage = 'url("' + src1 + '")';
    document.getElementById('wallpaper1').style.backgroundAttachment = 'absolute';
    document.getElementById('wallpaper1').style.backgroundPosition = 'center center';
    document.getElementById('wallpaper1').style.backgroundRepeat = "no-repeat";
    if (artFill == 1) {
      document.getElementById('wallpaper1').style.backgroundSize = 'cover';
    }
    else {
      document.getElementById('wallpaper1').style.backgroundSize = 'contain';
    }
    document.getElementById('wallpaper1').style.filter = "blur(" + artBlur + "px) brightness(50%) grayscale(20%)";
    document.getElementById('wtitle1').innerHTML = document.getElementById('currently-playing-title').innerHTML;
    document.getElementById('wtitle2').innerHTML = document.getElementsByClassName('player-artist')[0].innerHTML + " - " + document.getElementsByClassName('player-album')[0].innerHTML;

    document.getElementById('wallpaper2').style.width = window.innerWidth + "px";
    document.getElementById('wallpaper2').style.height = window.innerHeight - 90 - uiDis + "px";
    document.getElementById('wallpaper2').style.display = "block";
    document.getElementById('wallpaper2').getContext('2d').drawImage(document.getElementById("playerBarArt"), 0, 0, 1, 1);
    document.getElementById('wallpaper2').style.filter = "saturate(30) brightness(30%)";

    setTimeout(function () {
      document.getElementById('wallpaper1').style.opacity = 1;
      document.getElementById('wtitle1').style.opacity = 1;
      document.getElementById('wtitle2').style.opacity = 1;
    }, 1);
    for (j = 0; j < barAmnt; j++) {
      c = document.getElementById('bar' + j);
      c.style.backgroundColor = "#ffffff";
    }
    artInterval = setInterval(updateArt, 1000);

  }
  else {
    document.getElementById('wallpaper2').style.display = "none";
    document.getElementById('artToggle').style.color = '#aaaaaa';
    wallpaper = 0;
    document.getElementById('wallpaper1').style.opacity = 0;
    document.getElementById('wtitle1').style.opacity = 0;
    document.getElementById('wtitle2').style.opacity = 0;
    setTimeout(function () {
      document.getElementById('wallpaper1').style.display = "none";
      document.getElementById('wtitle1').style.display = "none";
      document.getElementById('wtitle2').style.display = "none";
    }, 501);
    barAmnt = 0;
    drawBars();
    clearInterval(artInterval);
  }
}

function updateArt() {
  var src1 = document.getElementById("playerBarArt").src;
  var indexOfEquals = src1.indexOf("=");
  src1 = src1.substring(0, indexOfEquals) + "=s" + artSize + "-c-e100";
  document.getElementById('wallpaper1').style.width = window.innerWidth + "px";
  document.getElementById('wallpaper1').style.height = window.innerHeight - 90 - uiDis + "px";
  document.getElementById('wallpaper1').style.backgroundImage = 'url("' + src1 + '")';
  document.getElementById('wtitle1').innerHTML = document.getElementById('currently-playing-title').innerHTML;
  document.getElementById('wtitle1').style.width = window.innerWidth - 150 + "px";
  document.getElementById('wtitle2').innerHTML = document.getElementsByClassName('player-artist')[0].innerHTML + " - " + document.getElementsByClassName('player-album')[0].innerHTML;

  //document.getElementById('wallpaper2').style.width=window.innerWidth+"px";
  //document.getElementById('wallpaper2').style.height=window.innerHeight-90-uiDis+"px";   
  document.getElementById('wallpaper2').getContext('2d').drawImage(document.getElementById("playerBarArt"), 0, 0, 1, 1);
  document.getElementById('wallpaper2').style.filter = "saturate(30) brightness(30%)";

  for (j = 0; j < barAmnt; j++) {
    c = document.getElementById('bar' + j);
    c.style.backgroundColor = "#ffffff";
  }
}


function changeResolution() {
  if (artSize == 1024) {
    artSize = 2048;
    artBlur = 2;
    document.getElementById('artRes').style.color = uiColor;
    document.getElementById('wallpaper1').style.filter = "blur(" + artBlur + "px) brightness(50%) grayscale(20%)";
  }

  else {
    artSize = 1024;
    artBlur = 5;
    document.getElementById('artRes').style.color = '#aaaaaa';
    document.getElementById('wallpaper1').style.filter = "blur(" + artBlur + "px) brightness(50%) grayscale(20%)";
  }
}


function changeArtFill() {
  if (artFill == 1) {
    artFill = 0;
    document.getElementById('artFill').style.color = "#aaaaaa";
  }
  else {
    artFill = 1;
    document.getElementById('artFill').style.color = uiColor;
  }
  if (wallpaper == 1) {
    if (artFill == 1) {
      document.getElementById('wallpaper1').style.backgroundSize = 'cover';
    }
    else {
      document.getElementById('wallpaper1').style.backgroundSize = 'contain';
    }
  }
}


function hideUI() {
  document.getElementById('addModButton').style.opacity = "0";
  showMods();
}


//try to do multi-key binds - maybe have the menu only open while holding leftSift+V or something
//could make an array of keys pressed and keys lifted
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  //on 'esc' click
  if (e.keyCode == '27') {
    document.getElementById('addModButton').style.opacity = "1";
    showViz();
  }
  //on'`' click
  if (e.keyCode == '192') {
  }
}


