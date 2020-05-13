//Greyson Flippo 
//Ac130veterans@gmail.com
//GreysonFlippo@gmail.com
//created 6-6-2016 :)
//updated 5-10-2020
//https://chrome.google.com/webstore/detail/music-visualizer-for-goog/ofhohcappnjhojpboeamfijglinngdnb

let showLogs = false;

let bar_visualizer_image = chrome.extension.getURL('Bar_Viz.png');
let wave_visualizer_image = chrome.extension.getURL('Wave_Viz.png');
let circle_visualizer_image = chrome.extension.getURL('Circle_Viz.png');
let ambient_visualizer_image = chrome.extension.getURL('Ambient_Viz.png');

let websiteConfig={
  name:"Default-Config",
  color:"#aaaaaa",
  fftUni:16384,
  bottom:90,
};

let userPreferences = {
  artClipping:true,
  colorCycle:true,
  auto_connect:true,
  show_banner:true,
  primary_color:null,
  max_height:110,
  smoothingTimeConstant:0,
  allow_youtube:true,
  allow_google_music:true,
  allow_youtube_music:true,
  allow_other:false,
  dark_mode:true
}

let mediaElements = [];
//                       bar, wav , cir , amb ,
let visualizerToggles=[false,false,false,false];
let visualizerToggleFunctions=[toggleBarVis,toggleWaveViz,toggleCircleViz,toggleAmbienceViz];
let visualizerToggleButtons=[];

let runBarVisualizer;
let drawBarsUpdate;

setTimeout(loaded, 100);

function loaded() {
  /*showLogs*/if(showLogs){console.log("Loading Extension...")};
  websiteConfig = getCurrentPage(window.location.href);
  /*showLogs*/if(showLogs){console.log("config loaded: ",websiteConfig.name)};
  retireveSettings();
  createElements();
  updateGUI();
  setInterval(updateGUI,250);
  findAudioSources();
  setInterval(findAudioSources,5000);
  findActiveAudioSource();
  setInterval(findActiveAudioSource,250);
}


//Defines correct profile based on webpage that is loaded
function getCurrentPage(url){
  if(url.includes("play.google")){
    return{
      name:"Google-Play-Music-Config",
      color:"#FF5722",
      color2:"#ffffff",
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
  document.body.appendChild(document.createElement('div')).id = 'Menu_Background';
  document.getElementById('Menu_Background').appendChild(document.createElement('div')).id = 'Menu_Container';
  document.getElementById('Menu_Background').addEventListener("click", (e)=>{
    if(e.target.id==="Menu_Background"){
      toggleMenu();
    }
  });

  document.getElementById('Menu_Background').appendChild(document.createElement('div')).id = 'Audio_Source_Identifier_Container';
  document.getElementById('Menu_Background').appendChild(document.createElement('div')).id = 'Key_Bindings_Container';
  document.getElementById('Menu_Background').appendChild(document.createElement('div')).id = 'Settings_Button_Container';
  document.getElementById('Key_Bindings_Container').innerText="Press ' f2 ' to open or close the visualizer menu";
  document.getElementById('Settings_Button_Container').innerText="Click here to customize";

  document.body.appendChild(document.createElement('div')).id = 'Notifications_Banner';

  document.getElementById('Menu_Container').appendChild(document.createElement('div')).id = 'Bar_Visualizer_Button';
  document.getElementById('Menu_Container').appendChild(document.createElement('div')).id = 'Wave_Visualizer_Button';
  document.getElementById('Menu_Container').appendChild(document.createElement('div')).id = 'Circle_Visualizer_Button';
  document.getElementById('Menu_Container').appendChild(document.createElement('div')).id = 'Ambient_Visualizer_Button';

  visualizerToggleButtons=[document.getElementById('Bar_Visualizer_Button'),document.getElementById('Wave_Visualizer_Button'),document.getElementById('Circle_Visualizer_Button'),document.getElementById('Ambient_Visualizer_Button')];

  document.getElementById('Bar_Visualizer_Button').classList.add("Button");
  document.getElementById('Bar_Visualizer_Button').style.backgroundImage="url('"+bar_visualizer_image+"')";
  document.getElementById('Bar_Visualizer_Button').addEventListener("click", ()=>{setActiveVisualizer(0)});
  document.getElementById('Bar_Visualizer_Button').innerHTML="<span id='Bar_Visualizer_Title' class='Button_Title'>Bar</span><span id='Bar_Visualizer_Text' class='Button_Text'>control + 1</span>";

  document.getElementById('Wave_Visualizer_Button').classList.add("Button");
  document.getElementById('Wave_Visualizer_Button').style.backgroundImage="url('"+wave_visualizer_image+"')";
  document.getElementById('Wave_Visualizer_Button').addEventListener("click", ()=>{setActiveVisualizer(1)});
  document.getElementById('Wave_Visualizer_Button').innerHTML="<span id='Wave_Visualizer_Title' class='Button_Title'>Wave</span><span id='Wave_Visualizer_Text' class='Button_Text'>control + 2</span>";

  document.getElementById('Circle_Visualizer_Button').classList.add("Button");
  document.getElementById('Circle_Visualizer_Button').style.backgroundImage="url('"+circle_visualizer_image+"')";
  document.getElementById('Circle_Visualizer_Button').addEventListener("click", ()=>{setActiveVisualizer(2)});
  document.getElementById('Circle_Visualizer_Button').innerHTML="<span id='Circle_Visualizer_Title' class='Button_Title'>Circle</span><span id='Circle_Visualizer_Text' class='Button_Text'>control + 3</span>";

  document.getElementById('Ambient_Visualizer_Button').classList.add("Button");
  document.getElementById('Ambient_Visualizer_Button').style.backgroundImage="url('"+ambient_visualizer_image+"')";
  document.getElementById('Ambient_Visualizer_Button').addEventListener("click", ()=>{setActiveVisualizer(3)});
  document.getElementById('Ambient_Visualizer_Button').innerHTML="<span id='Ambient_Visualizer_Title' class='Button_Title'>Ambient</span><span id='Ambient_Visualizer_Text' class='Button_Text'>control + 4</span>";

  /*showLogs*/if(showLogs){console.log("menu spawned")};

  document.body.appendChild(document.createElement('div')).id = 'settings_modal_background';
  document.getElementById('settings_modal_background').appendChild(document.createElement('div')).id = 'settings_modal';
  document.getElementById('settings_modal').appendChild(document.createElement('div')).id = 'settings_title';
  document.getElementById('settings_title').innerHTML='<span id="back_button">&#8592;</span>Settings';

  document.body.appendChild(document.createElement('canvas')).id="canvas1";

  document.body.appendChild(document.createElement('div')).id="ambience1";
  document.getElementById('ambience1').appendChild(document.createElement('div')).id = 'topGlow';
  document.getElementById('ambience1').appendChild(document.createElement('div')).id = 'bottomGlow';
  document.getElementById('ambience1').appendChild(document.createElement('div')).id = 'leftGlow';
  document.getElementById('ambience1').appendChild(document.createElement('div')).id = 'rightGlow';

}


function retireveSettings(){
  try{
    chrome.storage.local.get(['artClipping','colorCycle'], function(result) {
      userPreferences={...userPreferences,...result}
    });
  }
  catch(error){
    console.log("No Data To Retrieve: ", error)
  }
}

function updateSettings(settings){
  userPreferences = {...userPreferences,...settings};
  chrome.storage.local.set({...userPreferences}, function() {
  });
}

function toggleAlbumArtClipping(){
  let newSetting = !userPreferences.artClipping;
  updateSettings({artClipping:newSetting});
}

function toggleColorCycling(){
  let newSetting = !userPreferences.colorCycle;
  updateSettings({colorCycle:newSetting});
}

function setAlbumArtClick() {
  if(document.getElementById("playerBarArt")){
    document.getElementById("playerBarArt").addEventListener("click", toggleArtBackground);
    document.getElementById("playerBarArt").style.cursor = 'pointer';
    if(userPreferences.artClipping && document.getElementById('artBackground')){
      document.getElementById('artBackground').style.backgroundSize = 'cover';
    }
    else if(document.getElementById('artBackground')){
      document.getElementById('artBackground').style.backgroundSize = 'contain';
    }
  }
}



function toggleArtBackground(){
  if(!document.getElementById("artBackground")){
    document.body.appendChild(document.createElement('div')).id="artBackground";
    document.getElementById("artBackground").style.display="none";
  }
  if(document.getElementById("artBackground").style.display=="block"){
    document.getElementById("artBackground").style.display="none";
    temp = websiteConfig.color;
    websiteConfig.color = websiteConfig.color2;
    websiteConfig.color2 = temp;
  }
  else if(document.getElementById("artBackground").style.display=="none"){
    document.getElementById("artBackground").style.display="block"
    temp = websiteConfig.color;
    websiteConfig.color = websiteConfig.color2;
    websiteConfig.color2 = temp;
  }
  removeBars();
}

function updateArtWallpaperSource(){
  let src1 = document.getElementById("playerBarArt").src;
  let indexOfEquals = src1.indexOf("=");
  src1 = src1.substring(0, indexOfEquals) + "=s" + 1024 + "-c-e100";
  return src1;
}

function updateGUI(){
  document.getElementById('Audio_Source_Identifier_Container').innerText=mediaElements.length + " Audio Source(s) Connected";
  document.getElementById('canvas1').setAttribute('height', window.innerHeight - websiteConfig.bottom);
  document.getElementById('canvas1').setAttribute('width', window.innerWidth);
  if(websiteConfig.name="Google-Play-Music-Config"){
    setAlbumArtClick(); 
    if(document.getElementById("artBackground")){
      document.getElementById("artBackground").style.backgroundImage=`url(${updateArtWallpaperSource()})`;
      document.getElementById("artBackground").style.height = window.innerHeight - websiteConfig.bottom + "px";
      document.getElementById("artBackground").innerHTML=`
        <p id="wtitle1">${document.getElementById('currently-playing-title').innerHTML}</p>
        <p id="wtitle2">${document.getElementsByClassName('player-artist')[0].innerHTML + " - " + document.getElementsByClassName('player-album')[0].innerHTML}</p>
        <div id="backgroundShade"></div>`;
    }
    if (userPreferences.dark_mode) { 
      document.body.style.filter='invert(1)';
      document.querySelector("#content-container").style.backgroundColor='#eeeeee'
      document.getElementById('ambience1').style.filter='invert(1)';
      document.getElementById("Menu_Background").style.filter='invert(1)';
      invertImages(true);
    } else {
      document.body.style.filter='invert(0)';
      document.querySelector("#content-container").style.backgroundColor=null
      document.getElementById('ambience1').style.filter='invert(0)';
      document.getElementById("Menu_Background").style.filter='invert(0)';
      invertImages(false);
    }
  }
}


function findAudioSources(){
  let prevMediaElementsLength = mediaElements.length;
  let audioElements = document.getElementsByTagName("audio");
  let videoElements = document.getElementsByTagName("video");
  let foundMediaElements = [...audioElements,...videoElements];
  for(let i = 0; i < foundMediaElements.length; i++){
    if(foundMediaElements[i].id==null || foundMediaElements[i].id==""){
      foundMediaElements[i].id="mediaElement"+mediaElements.length;

      let audioCtx=new AudioContext();
      let analyser=audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = userPreferences.smoothingTimeConstant;
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

    //new media elements hooked
    if(prevMediaElementsLength < mediaElements.length){
      let txt = ""+ mediaElements.length+ " Audio Sources Connected <br> Press ' f2 ' To Show The Visualizer Menu";
      showBanner(txt);
    }
}


function showBanner(txt){
  setTimeout(()=>{
    document.getElementById("Notifications_Banner").style.bottom = "150px";
    document.getElementById("Notifications_Banner").innerHTML = txt;
  },2000);
  setTimeout(()=>{
    document.getElementById("Notifications_Banner").style.bottom = "-100px";
  },7000);
}


let previousAudioSource = 0;
function findActiveAudioSource(){
  let bestSource = previousAudioSource;
  for(let i = 0; i < mediaElements.length; i++){
    mediaElements[i].analyser.getByteTimeDomainData(mediaElements[i].dataArray);
    if(mediaElements[i].dataArray[1]-128 != 0 || mediaElements[i].dataArray[mediaElements[i].dataArray.length-1]-128 != 0 || mediaElements[i].dataArray[Math.floor(mediaElements[i].dataArray.length/2)]-128 != 0){
      bestSource = i;
    }
  }
  previousAudioSource = bestSource;
  /*showLogs*/if(showLogs){console.log("Current Source: ",bestSource);}
  return bestSource;
}


let barWidth = 12;
let barAmnt = 0;
let barSpacing = 2;
let vizReady = 0;

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
  vizReady = barAmnt;
}


function barVis()
{
  let activeSource = findActiveAudioSource();
  mediaElements[activeSource].analyser.getByteFrequencyData(mediaElements[activeSource].frequencyData);
  for (let i = 0; i < barAmnt; i++) {
    if (vizReady == barAmnt) {
      const formula = Math.ceil(Math.pow(i, 1.25));
      const frequencyData = mediaElements[activeSource].frequencyData[formula];
      const pop = ((frequencyData * frequencyData * frequencyData) / (255 * 255 * 255)) * ((window.innerHeight - websiteConfig.bottom) * .30) * (userPreferences.max_height / 100);
      document.getElementById('bar' + i).style.height = pop + 'px';
    }
  }
}

function toggleBarVis(){
  if(visualizerToggles[0] == false){
    drawBars();
    visualizerToggles[0] = true;
    runBarVisualizer=setInterval(barVis,1);
    drawBarsUpdate=setInterval(drawBars,500);
  }
  else{
    clearInterval(drawBarsUpdate);
    clearInterval(runBarVisualizer);
    visualizerToggles[0] = false;
    removeBars();
  }
}

function toggleWaveViz(){
  if(visualizerToggles[1] == false){
    document.getElementById('canvas1').style.display="block";
    visualizerToggles[1] = true;
    window.requestAnimationFrame(waveVis);
  }
  else{
    document.getElementById('canvas1').style.display="none";
    visualizerToggles[1] = false;
  }
}

function toggleCircleViz(){
  if(visualizerToggles[2] == false){
    document.getElementById('canvas1').style.display="block";
    visualizerToggles[2] = true;
    window.requestAnimationFrame(waveVis);
  }
  else{
    document.getElementById('canvas1').style.display="none";
    visualizerToggles[2] = false;
  }
}



let red = 255;
let green = 0;
let blue = 0;

function waveVis() {
  let canvasCtx = document.getElementById('canvas1').getContext("2d");
  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight - websiteConfig.bottom;
    if (websiteConfig.name == "YouTube-Config") { 
      document.getElementById("content").onload = function () { console.log("Music Visualizer: YouTube"); } 
      if(userPreferences.dark_mode) document.getElementById('canvas1').style.backgroundColor='black';
    }
    if(userPreferences.colorCycle){
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
    canvasCtx.lineWidth = 3000/window.innerHeight;
    canvasCtx.shadowColor = '#000';
    canvasCtx.shadowBlur = 1;
    canvasCtx.shadowOffsetX = 0;
    canvasCtx.shadowOffsetY = 0;
    if (visualizerToggles[2]) { canvasCtx.lineWidth = 3; }
    canvasCtx.beginPath();
    let sliceWidth = WIDTH/mediaElements[activeSource].bufferLength * 4;
    let radius1 = HEIGHT / 4;
    let x = 0;
    let lastx = WIDTH / 2 + radius1;
    let lasty = HEIGHT / 2;

    for (let i = mediaElements[activeSource].bufferLength/2; i < mediaElements[activeSource].bufferLength; i++) {
      let v = mediaElements[activeSource].dataArray[i] / 128.0;
      let radius2 = radius1 + (v * v * 150) * (HEIGHT/1500);
      let y = v * HEIGHT / 2;
      if (visualizerToggles[2]) {
          canvasCtx.lineTo((WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength *2), (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength *2) * -1);
      }
      else {
          canvasCtx.lineTo(x, y);
      }
      lastx = (WIDTH / 2) + radius2 * Math.cos(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength);
      lasty = (HEIGHT / 2) + radius2 * Math.sin(i * (2 * Math.PI) / mediaElements[activeSource].bufferLength) * -1;
      x += sliceWidth;
    }
    if (visualizerToggles[2]) { canvasCtx.lineTo(lastx, lasty); }
    canvasCtx.stroke();
    if(visualizerToggles[2] || visualizerToggles[1]){window.requestAnimationFrame(waveVis);}
}


function ambientVis()
{
  let activeSource = findActiveAudioSource();
  mediaElements[activeSource].analyser.getByteFrequencyData(mediaElements[activeSource].frequencyData);

  document.getElementById('ambience1').style.display = "block";
  document.getElementById('ambience1').style.height = window.innerHeight - websiteConfig.bottom + "px";
  document.getElementById("ambience1").style.boxShadow = "inset 0px 0px 500px rgba(255,255,255," + mediaElements[activeSource].frequencyData[2] / 255 + ")";

  document.getElementById("topGlow").style.boxShadow = "0px 0px 500px 500px rgba(50,50,255," + (mediaElements[activeSource].frequencyData[8] * mediaElements[activeSource].frequencyData[8]) / (255 * 255) + ")";
  document.getElementById("bottomGlow").style.boxShadow = "0px 0px 500px 500px rgba(255,50,50," + (mediaElements[activeSource].frequencyData[40] * mediaElements[activeSource].frequencyData[40]) / (255 * 255) + ")";
  document.getElementById("leftGlow").style.boxShadow = "0px 0px 500px 500px rgba(50,255,50," + (mediaElements[activeSource].frequencyData[160] * mediaElements[activeSource].frequencyData[160]) / (255 * 255) + ")";
  document.getElementById("rightGlow").style.boxShadow = "0px 0px 500px 500px rgba(255,255,50," + (mediaElements[activeSource].frequencyData[500] * mediaElements[activeSource].frequencyData[500]) / (255 * 255) + ")";
}


let runAmbienceVisualizer;

function toggleAmbienceViz(){
  if(visualizerToggles[3] == false){
    visualizerToggles[3] = true;
    runAmbienceVisualizer=setInterval(ambientVis,1);
  }
  else{
    document.getElementById('ambience1').style.display = "none";
    clearInterval(runAmbienceVisualizer);
    visualizerToggles[3] = false;
  }
}


function toggleMenu(){
  if(document.getElementById('Menu_Background').style.display == "flex"){
    document.getElementById('Menu_Background').style.display = "none";
  }
  else{
    document.getElementById('Menu_Background').style.display = "flex";
  }
}

function setActiveVisualizer(vizNum){
  if(!visualizerToggles[vizNum]){
    turnOffAllVisualizers();
  }
  if(mediaElements.length>0){
    visualizerToggleButtons[vizNum].classList.toggle("Button_Selected");
    visualizerToggleFunctions[vizNum]();
  };
}

function turnOffAllVisualizers(){
  for(let i = 0; i < visualizerToggles.length; i++){
    if(visualizerToggles[i]){
      visualizerToggleFunctions[i]();
      visualizerToggleButtons[i].classList.toggle("Button_Selected");
    }
  }
}

function switchDarkMode(){
  userPreferences.dark_mode ? userPreferences.dark_mode = false : userPreferences.dark_mode = true;
}

function invertImages(invert) {
  const images = document.getElementsByTagName('img')
  for (let i = 0; i < images.length; i++) {
    invert ? images[i].classList.add('invertedImages') : images[i].classList.remove('invertedImages')
  }
}


let keysPressed = [];

document.onkeydown = keyPressed;
document.onkeyup = keyReleased;

function keyPressed(e) {

  let secondaryKey = 17 // control
  // let openVisualizerKey = 86; // v
  let openVisualizerKey = 113; // f2
  let escapeKey = 27;
  let devKey = 192;  // `

  let viz1Key = 49;  // 1
  let viz2Key = 50;  // 2
  let viz3Key = 51;  // 3
  let viz4Key = 52;  // 4


  if(keysPressed.length==0 || keysPressed[keysPressed.length-1]!=e.keyCode){
    keysPressed.push(e.keyCode);
  }

  if(keysPressed.includes(openVisualizerKey)){
    toggleMenu();
  }

  if(keysPressed.includes(secondaryKey) && keysPressed.includes(viz1Key)){
    setActiveVisualizer(0);
  }

  if(keysPressed.includes(secondaryKey) && keysPressed.includes(viz2Key)){
    setActiveVisualizer(1);
  }

  if(keysPressed.includes(secondaryKey) && keysPressed.includes(viz3Key)){
    setActiveVisualizer(2);
  }

  if(keysPressed.includes(secondaryKey) && keysPressed.includes(viz4Key)){
    setActiveVisualizer(3);
  }

  if(keysPressed.includes(escapeKey) && document.getElementById('Menu_Background').style.display == "flex"){
    switchDarkMode()
    toggleMenu();
  }

  else if(keysPressed.includes(escapeKey) && document.getElementById('Menu_Background').style.display == "none"){
    turnOffAllVisualizers();
  }

}

function keyReleased(e){
  keysPressed.pop();
}
