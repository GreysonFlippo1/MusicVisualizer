//Greyson Flippo 
//Ac130veterans@gmail.com
//GreysonFlippo@gmail.com
//created 6-6-2016 :)
//updated 8-20-2020
//https://chrome.google.com/webstore/detail/music-visualizer-for-goog/ofhohcappnjhojpboeamfijglinngdnb




let websiteConfig={
  name:"Default-Config",
  color:"#CCCCCC",
  fftUni:16384
};


setTimeout(loaded, 100);

function loaded() {
  websiteConfig = getCurrentPage(window.location.href);
  console.log(websiteConfig.name);
}

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
      color:"#CCCCCC",
      fftUni:16384
    }
  }
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


