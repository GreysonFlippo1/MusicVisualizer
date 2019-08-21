//Greyson Flippo 
//Ac130veterans@gmail.com
//GreysonFlippo@gmail.com
//created 6-6-2016 :)
//updated 8-20-2020
//https://chrome.google.com/webstore/detail/music-visualizer-for-goog/ofhohcappnjhojpboeamfijglinngdnb

let showLogs = false;

const Resources_Add_Button_Image = chrome.extension.getURL('add.png');

let websiteConfig={
  name:"Default-Config",
  color:"#aaaaaa",
  fftUni:16384
};

let mediaElements = [];

setTimeout(loaded, 100);

function loaded() {
  /*showLogs*/if(showLogs){console.log("Loading Extension...")};
  websiteConfig = getCurrentPage(window.location.href);
  /*showLogs*/if(showLogs){console.log("config loaded: ",websiteConfig.name)};
  createMenu();
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
      fftUni:16384
    }
  }
  else if(url.includes("music.youtube")){
    return{
      name:"YouTube-Music-Config",
      color:"#FFFFFF",
      fftUni:16384
    }
  }
  else if(url.includes("youtube")){
    return{
      name:"YouTube-Config",
      color:"#FF0000",
      fftUni:8192
    }
  }
  else{
    return{
      name:"Default-Config",
      color:"#aaaaaa",
      fftUni:16384
    }
  }
}


function createMenu(){
  document.body.appendChild(document.createElement('img')).id = 'Activate_Button';
  document.getElementById('Activate_Button').classList.add("Button");
  document.getElementById('Activate_Button').src = Resources_Add_Button_Image;
  document.getElementById('Activate_Button').addEventListener("click", ()=>{alert("clicked")});
  /*showLogs*/if(showLogs){console.log("menu button spawned")};
}


function updateGUI(){
  document.getElementById('Activate_Button').style.backgroundColor = websiteConfig.color;
  document.getElementById('Activate_Button').style.left = (window.innerWidth-150)/2 + "px";
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
      analyser.smoothingTimeConstant = .55;
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


//mediaElements[1].analyser.getByteFrequencyData(frequencyData);

//analyser.getByteFrequencyData(frequencyData);
//frequencyData[50];

// audioCtx=new AudioContext();
// analyser=audioCtx.createAnalyser();
// analyser.smoothingTimeConstant = .55;
// audio=document.getElementById('audioSource');
// source=audioCtx.createMediaElementSource(audio);
// source.connect(analyser);
// analyser.connect(audioCtx.destination);
// analyser.fftSize = fftUni ;
// frequencyData=new Uint8Array(analyser.frequencyBinCount);
// bufferLength=analyser.frequencyBinCount;
// dataArray = new Uint8Array(bufferLength);

//try to do multi-key binds - maybe have the menu only open while holding leftSift+V or something
//could make an array of keys pressed and keys lifted
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  //on 'esc' click
  if (e.keyCode == '27') {
  }
  //on'`' click
  if (e.keyCode == '192') {
  }
}


