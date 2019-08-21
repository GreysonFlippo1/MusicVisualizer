//Greyson Flippo 
//Ac130veterans@gmail.com
//GreysonFlippo@gmail.com
//created 6-6-2016 :)
//updated 8-21-2020
//https://chrome.google.com/webstore/detail/music-visualizer-for-goog/ofhohcappnjhojpboeamfijglinngdnb

let showLogs = false;

const Resources_Add_Button_Image = chrome.extension.getURL('add.png');

let websiteConfig={
  name:"Default-Config",
  color:"#aaaaaa",
  fftUni:16384,
  bottom:90,
};

let mediaElements = [];

setTimeout(loaded, 100);

function loaded() {
  /*showLogs*/if(showLogs){console.log("Loading Extension...")};
  websiteConfig = getCurrentPage(window.location.href);
  /*showLogs*/if(showLogs){console.log("config loaded: ",websiteConfig.name)};
  createElements();
  updateGUI();
  setInterval(updateGUI,100);
  findAudioSources();
  setInterval(findAudioSources,5000);
  findActiveAudioSource();
  setInterval(findActiveAudioSource,100);
}


//Defines correct profile based on webpage that is loaded
function getCurrentPage(url){
  if(url.includes("play.google")){
    return{
      name:"Google-Play-Music-Config",
      color:"#FF5722",
      fftUni:16384,
      bottom:90,
    }
  }
  else if(url.includes("music.youtube")){
    return{
      name:"YouTube-Music-Config",
      color:"#FFFFFF",
      fftUni:16384,
      bottom:83,
    }
  }
  else if(url.includes("youtube")){
    return{
      name:"YouTube-Config",
      color:"#FF0000",
      fftUni:8192,
      bottom:0,
    }
  }
  else{
    return{
      name:"Default-Config",
      color:"#aaaaaa",
      fftUni:16384,
      bottom:0,
    }
  }
}


function createElements(){
  document.body.appendChild(document.createElement('img')).id = 'Activate_Button';
  document.getElementById('Activate_Button').classList.add("Button");
  document.getElementById('Activate_Button').src = Resources_Add_Button_Image;
  document.getElementById('Activate_Button').addEventListener("click", ()=>{alert("clicked")});
  /*showLogs*/if(showLogs){console.log("menu button spawned")};

  document.body.appendChild(document.createElement('canvas')).id="canvas1";
}


function updateGUI(){
  document.getElementById('Activate_Button').style.backgroundColor = websiteConfig.color;
  document.getElementById('Activate_Button').style.left = (window.innerWidth-150)/2 + "px";
  document.getElementById('canvas1').setAttribute('height', window.innerHeight - websiteConfig.bottom);
  document.getElementById('canvas1').setAttribute('width', window.innerWidth);
}

function findAudioSources(){
  let audioElements = document.getElementsByTagName("audio");
  let videoElements = document.getElementsByTagName("video");
  let foundMediaElements = [...audioElements,...videoElements];
  for(let i = 0; i < foundMediaElements.length; i++){
    if(foundMediaElements[i].id==null || foundMediaElements[i].id==""){
      foundMediaElements[i].id="mediaElement"+mediaElements.length;

      let audioCtx=new AudioContext();
      let analyser=audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = .6;
      let source = audioCtx.createMediaElementSource(foundMediaElements[i]);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = websiteConfig.fftUni ;
      let frequencyData=new Uint8Array(analyser.frequencyBinCount);
      let bufferLength=analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      mediaElements[mediaElements.length]={
        node: foundMediaElements[i],
        attached:true,
        audioCtx,
        analyser,
        frequencyData,
        bufferLength,
        dataArray,
      };
    }
  }

  /*showLogs*/if(showLogs){
    console.log("Media Elements Found: ", mediaElements);
    mediaElements[1].analyser.getByteFrequencyData(mediaElements[1].frequencyData);
    mediaElements[2].analyser.getByteFrequencyData(mediaElements[2].frequencyData);
    mediaElements[3].analyser.getByteFrequencyData(mediaElements[3].frequencyData);
    console.log("Frequency Datas: ", mediaElements[1].frequencyData[50], mediaElements[2].frequencyData[50], mediaElements[3].frequencyData[50] )
  };
}

function findActiveAudioSource(){
  let bestSource = 0;
  let max = 0;
  for(let i = 0; i < mediaElements.length; i++){
    mediaElements[i].analyser.getByteFrequencyData(mediaElements[i].frequencyData);
    if(mediaElements[i].frequencyData[50]>max){
      max = mediaElements[i].frequencyData[50];
      bestSource = i;
    }
  }
  /*showLogs*/if(showLogs){console.log("Current Source: ",bestSource);}
  return bestSource;
}


let barWidth = 12;
let barAmnt = 0;
let vizReady = 0;
let barSpacing = 2;

function drawBars() {
  let barAmntTemp = 0;
  for (let i = 0; i < window.innerWidth + barSpacing + (barWidth / 2); i += (barWidth + barSpacing)) { barAmntTemp++; }
  if (barAmntTemp > barAmnt) {
    for (let i = 0; i < barAmntTemp; i++) {
      if (barAmntTemp > barAmnt) {
        let bars = document.createElement('div');
        bars.setAttribute("id", "bar" + i);
        bars.classList.add("bars");
        document.body.appendChild(bars);
      }
      document.getElementById('bar' + i).style.left = (barWidth + barSpacing) * (i - 1) + 'px';
      document.getElementById('bar' + i).style.bottom = websiteConfig.bottom + 'px';
      document.getElementById('bar' + i).style.backgroundColor = websiteConfig.color;
    }
  }

  else {
    for (let i = barAmntTemp; i < barAmnt; i++) {
      document.getElementById('bar' + i).remove();
    }
  }

  barAmnt = barAmntTemp;
  vizReady = barAmnt;
}

function removeBars(){
  for (let i = 0; i < barAmnt; i++) {
    document.getElementById('bar' + i).remove();
  }
  barAmnt=0;
}

let runBarVisualizer;
let drawBarsUpdate;
let isBarVisualizerRunning = false;

function barVis()
{
  let activeSource = findActiveAudioSource();
  mediaElements[activeSource].analyser.getByteFrequencyData(mediaElements[activeSource].frequencyData);

  let last = -1;
  for (let i = 0; i < barAmnt; i++) {
    if (vizReady == barAmnt) {
      let smooth = 0;
      let formula = Math.ceil(Math.pow(i, 1.2));
      let pop;
      pop = (mediaElements[activeSource].frequencyData[formula]) * (mediaElements[activeSource].frequencyData[formula]) * (mediaElements[activeSource].frequencyData[formula] / 3) / (255 * 255 * (255 / 3)) * ((window.innerHeight - 100) * .30);

      if (last != -1) {
        smooth = pop + last / 2;
      }
      else {
        smooth = pop;
      }
      last = pop;
      document.getElementById('bar' + i).style.height = smooth + 'px';
    }
  }
}

function toggleBarVis(){
  if(isBarVisualizerRunning == false){
    drawBars();
    isBarVisualizerRunning = true;
    runBarVisualizer=setInterval(barVis,1);
    drawBarsUpdate=setInterval(drawBars,500);
  }
  else{
    clearInterval(drawBarsUpdate);
    clearInterval(runBarVisualizer);
    isBarVisualizerRunning = false;
    removeBars();
  }
}


let isWaveVisualizerRunning = false;
let isCircleVisualizerRunning = false;


let red = 255;
let green = 0;
let blue = 0;


function toggleWaveViz(){
  if(isWaveVisualizerRunning == false){
    document.getElementById('canvas1').style.display="block";
    isWaveVisualizerRunning = true;
    window.requestAnimationFrame(waveVis);
  }
  else{
    document.getElementById('canvas1').style.display="none";
    isWaveVisualizerRunning = false;
  }
}


function toggleCircleViz(){
  if(isCircleVisualizerRunning == false){
    document.getElementById('canvas1').style.display="block";
    isCircleVisualizerRunning = true;
    window.requestAnimationFrame(waveVis);
  }
  else{
    document.getElementById('canvas1').style.display="none";
    isCircleVisualizerRunning = false;
  }
}

function waveVis() {
  console.log("running");
  let canvasCtx = document.getElementById('canvas1').getContext("2d");
  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight - websiteConfig.bottom;
    if (websiteConfig.name == "YouTube-Config") { document.getElementById("content").onload = function () { console.log("updating visualizer"); } }
    if (red == 255){
      if (blue > 0) { blue--; }
      else { green++ }
    }

    if (green == 255){
      if (red > 0) { red--; }
      else { blue++ }
    }

    if (blue == 255){
      if (green > 0) { green--; }
      else { red++; }
    }
    let activeSource = findActiveAudioSource();
    mediaElements[activeSource].analyser.getByteTimeDomainData(mediaElements[activeSource].dataArray);
    canvasCtx.width = WIDTH;
    canvasCtx.height = HEIGHT;
    document.getElementById('canvas1').setAttribute('width', window.innerWidth);
    document.getElementById('canvas1').setAttribute('height', window.innerHeight - websiteConfig.bottom);
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    canvasCtx.lineWidth = 1.3;
    if (isCircleVisualizerRunning) { canvasCtx.lineWidth = 3; }
    canvasCtx.beginPath();
    let sliceWidth = 1;
    let radius1 = HEIGHT / 2 - 300;
    let x = 0;
    let lastx = WIDTH / 2 + radius1;
    let lasty = HEIGHT / 2;

    for (let i = 0; i < mediaElements[activeSource].bufferLength; i++) {
      let v = mediaElements[activeSource].dataArray[i] / 128.0;
      let radius2 = radius1 + (v * v * 150);
      let y = v * HEIGHT / 2;
      if (isCircleVisualizerRunning) {
        if (i === 0) {
          canvasCtx.moveTo((WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength), (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength) * -1);
        }
        else {
          canvasCtx.lineTo((WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength), (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength) * -1);
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
      lastx = (WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength);
      lasty = (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength) * -1;
      x += sliceWidth;
    }
    if (isCircleVisualizerRunning) { canvasCtx.lineTo(lastx, lasty); }
    else { canvasCtx.lineTo(window.innerWidth, window.innerHeight / 2); }
    canvasCtx.stroke();
    if(isCircleVisualizerRunning || isWaveVisualizerRunning){window.requestAnimationFrame(waveVis);}
}




//try to do multi-key binds - maybe have the menu only open while holding leftSift+V or something
//could make an array of keys pressed and keys lifted
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  //on 'esc' click
  if (e.keyCode == '27') {
    //toggleBarVis();
    toggleWaveViz();
    //toggleCircleViz();
  }
  //on'`' click
  if (e.keyCode == '192') {
  }
}


