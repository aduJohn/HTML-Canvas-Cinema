$(document).ready(function() {
    //Redimensionam canvas-ul unde punem filmul sa fie egal cu div-ul respectiv
    var filmCanvas = $("#film")[0];
    filmCanvas.width = $("#film_div").width();
    filmCanvas.height = $("#film_div").height();
    //Redimensionam canvas-ul unde punem histograma sa fie egal cu div-ul respectiv
    var histogramCanvas = $("#histogram")[0];
    histogramCanvas.width = $("#histogram_div").width();
    histogramCanvas.height = $("#histogram_div").height();

    //Preluam contextele pentru fiecare canvas
    var filmCtx = filmCanvas.getContext("2d");
    var histogramCtx = histogramCanvas.getContext("2d");

    //Preluam dimensiunile pentru fiecare canvas
    var filmW = filmCtx.canvas.width;
    var filmH = filmCtx.canvas.height;
    var histogramW = histogramCtx.canvas.width;
    var histogramH = histogramCtx.canvas.height;

    //Preluam toate "drumurile" catre toate videoclipurile necesare
    var videosPaths = [
      "media/Dedication - Short Film.mp4",
      "media/Motivational Soccer Video.mp4",
      "media/Boxing Motivation Discipline.mp4",
      "media/Dream Land (Road Trip).mp4"
    ]
    var videosCCs = [
      "lib/Dedication - Short Film.json"
    ]
    var currentVideo = 0;
    //Functia care deseneaza la inceput structura canvas-ului
    function drawComponents(){
      filmCtx.strokeStyle = "rgba(234, 224, 213,1)";
      filmCtx.fillStyle = "rgba(234, 224, 213,1)";
      filmCtx.lineWidth = 5;
      //Marginea filmului
      filmCtx.strokeRect(0,0,filmW *0.8,filmH*0.9);
      //Marginea control barului
      filmCtx.strokeRect(0,filmH*0.9,filmW*0.8,filmH*0.1);
      //Marginea effects barului
      filmCtx.strokeRect(filmW*0.8,0,filmW *0.2,filmH);

      var controlsBarW = filmW * 0.8;
      var controlsBarH = filmH * 0.1;
      //Vrem ca cele 4 controale (Previous, Play, Stop, Next) sa fie toate impartite in mod egal
      //pe prima jumatate a control barului
      //Butonul de "previous film" - 0.5*0.25 -> un sfert din jumatate
      filmCtx.strokeRect(0,filmH*0.9,controlsBarW*0.5*0.25,filmH*0.1);
      //Butonul de "play"
      filmCtx.strokeRect(controlsBarW*0.5*0.25,filmH*0.9,controlsBarW*0.5*0.25,controlsBarH);
      //Butonul de "stop"
      filmCtx.strokeRect(controlsBarW*0.5*0.5,filmH*0.9,controlsBarW*0.5*0.25,controlsBarH);
      //Butonul de "next film"
      filmCtx.strokeRect(controlsBarW*0.5*0.75,filmH*0.9,controlsBarW*0.5*0.25,controlsBarH);
      //Butonul de CC
      filmCtx.strokeRect(controlsBarW*0.5*1.75,filmH*0.9,controlsBarW*0.5*0.25,controlsBarH)
      //Desenarea vizuala a controalelor
      //Desenarea "previous film"
      //Vom masura dimensiunile standard ale fiecarui control in parte
      var controlX = controlsBarW*0.5*0.25;
      var controlY = controlsBarH;

      //Desenare |
      filmCtx.lineWidth = 2;
      filmCtx.strokeRect(controlX*0.6,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      filmCtx.fillRect(controlX*0.6,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      //Desenare <|
      filmCtx.beginPath();
      filmCtx.moveTo(controlX*0.15,filmH*0.9+controlY*0.5);
      filmCtx.lineTo(controlX*0.45,filmH*0.9+controlY*0.1);
      filmCtx.lineTo(controlX*0.45,filmH*0.9+controlY*0.9);
      filmCtx.closePath();
      filmCtx.stroke();
      filmCtx.fill();

      //Desenarea "play"
      filmCtx.beginPath();
      filmCtx.moveTo(controlX+controlX*0.33,filmH*0.9+controlY*0.1);
      filmCtx.lineTo(controlX+controlX*0.66,filmH*0.9+controlY*0.5);
      filmCtx.lineTo(controlX+controlX*0.33,filmH*0.9+controlY*0.9);
      filmCtx.closePath();
      filmCtx.stroke();
      filmCtx.fill();

      //Desenarea "stop"
      //primul |
      filmCtx.strokeRect(controlX*2+controlX*0.5*0.4,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      filmCtx.fillRect(controlX*2+controlX*0.5*0.4,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      //al doilea |
      filmCtx.strokeRect(controlX*2+controlX*0.6,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      filmCtx.fillRect(controlX*2+controlX*0.6,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);

      //Desenare "next video"

      //Desenare |
      filmCtx.lineWidth = 2;
      filmCtx.strokeRect(controlX*3+controlX*0.2,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      filmCtx.fillRect(controlX*3+controlX*0.2,filmH*0.9+controlY*0.1,controlX*0.5*0.33,controlY*0.8);
      //Desenare |>
      filmCtx.beginPath();
      filmCtx.moveTo(controlX*3+controlX*0.5,filmH*0.9+controlY*0.1);
      filmCtx.lineTo(controlX*3+controlX*0.83,filmH*0.9+controlY*0.5);
      filmCtx.lineTo(controlX*3+controlX*0.5,filmH*0.9+controlY*0.9);
      filmCtx.closePath();
      filmCtx.stroke();
      filmCtx.fill();
      
      filmCtx.font = "30px Georgia";
      //Scriere text CC
      filmCtx.fillText("CC",controlsBarW*0.5*1.75+controlsBarW*0.5*0.25/2-20,filmH*0.9+35);

      //Desenarea barei de efecte
      var effectsBarW = filmW * 0.2;
      var effectsBarH = filmH/7;

      var effectsX = filmW*0.8;
      var effectsY = 0;
      for(var i = 0;i<7;i++){

        filmCtx.strokeRect(filmW*0.8,effectsY,effectsBarW,effectsBarH);
        effectsY += effectsBarH;
      }
      filmCtx.font = "20px Georgia";
      //Desenare text pe fiecare effect
      filmCtx.fillText("alb/negru",effectsX+effectsBarW*0.2,effectsBarH*0.6);
      filmCtx.fillText("sepia",effectsX+effectsBarW*0.2,effectsBarH+effectsBarH*0.6);
      filmCtx.fillText("negativ",effectsX+effectsBarW*0.2,effectsBarH*2+effectsBarH*0.6);
      filmCtx.fillText("salvare cadru",effectsX+effectsBarW*0.2,effectsBarH*6+effectsBarH*0.6);

      //Impartirea cadrelor de rgb + si rgb-
      filmCtx.strokeRect(effectsX,effectsBarH*3,effectsBarW*0.5,effectsBarH);
      filmCtx.strokeRect(effectsX,effectsBarH*4,effectsBarW*0.5,effectsBarH);
      filmCtx.strokeRect(effectsX,effectsBarH*5,effectsBarW*0.5,effectsBarH);

      filmCtx.fillStyle = "red";
      filmCtx.fillText("r+",effectsX+effectsBarW*0.2,effectsBarH*3+effectsBarH*0.6);
      filmCtx.fillText("r-",effectsX+effectsBarW*0.7,effectsBarH*3+effectsBarH*0.6);

      filmCtx.fillStyle = "green";
      filmCtx.fillText("g+",effectsX+effectsBarW*0.2,effectsBarH*4+effectsBarH*0.6);
      filmCtx.fillText("g-",effectsX+effectsBarW*0.7,effectsBarH*4+effectsBarH*0.6);

      filmCtx.fillStyle = "blue";
      filmCtx.fillText("b+",effectsX+effectsBarW*0.2,effectsBarH*5+effectsBarH*0.6);
      filmCtx.fillText("b-",effectsX+effectsBarW*0.7,effectsBarH*5+effectsBarH*0.6);

    }
    drawComponents();
    function getCursorPosition(canvas, event) {
      const rect = canvas.getBoundingClientRect()
      const userClickX = event.clientX - rect.left
      const userClickY = event.clientY - rect.top
      return {x: userClickX, y: userClickY};
  }
  filmCanvas.addEventListener('click', (e)=>{
      const userClickCoords = getCursorPosition(filmCanvas,e)
      var controlsBarW = filmW * 0.8;
      var controlsBarH = filmH * 0.1;

      //Cream niste constante pentru fiecare control si efect de mai de sus
      const previousPos = {
        x: 0,
        y: filmH*0.9,
        w: controlsBarW *0.5*0.25-1,
        h: controlsBarH
      };
      const playPos = {
        x: controlsBarW*0.5*0.25,
        y: filmH*0.9,
        w: controlsBarW *0.5*0.25-1,
        h: controlsBarH
      };
      const stopPos = {
        x: controlsBarW*0.5*0.5,
        y: filmH*0.9,
        w: controlsBarW *0.5*0.25-1,
        h: controlsBarH
      };
      const nextPos = {
        x: controlsBarW*0.5*0.75,
        y: filmH*0.9,
        w: controlsBarW *0.5*0.25,
        h: controlsBarH
      };
      const CCPos = {
        x:controlsBarW*0.5*1.75,
        y:filmH*0.9,
        w: controlsBarW *0.5*0.25,
        h: controlsBarH
      }
      var effectsBarW = filmW * 0.2;
      var effectsBarH = filmH/7;

      const albNegruPos = {
        x: filmW*0.8,
        y: 0,
        w: effectsBarW,
        h: effectsBarH
      };
      const sepiaPos = {
        x: filmW*0.8,
        y: effectsBarH,
        w: effectsBarW,
        h: effectsBarH
      };
      const negativPos = {
        x: filmW*0.8,
        y: effectsBarH*2,
        w: effectsBarW,
        h: effectsBarH
      };
      const rPlusPos = {
        x: filmW*0.8,
        y: effectsBarH*3,
        w: effectsBarW/2-1,
        h: effectsBarH
      };
      const rMinusPos = {
        x: filmW*0.8+effectsBarW/2,
        y: effectsBarH*3,
        w: effectsBarW/2,
        h: effectsBarH
      };
      const gPlusPos = {
        x: filmW*0.8,
        y: effectsBarH*4,
        w: effectsBarW/2-1,
        h: effectsBarH
      };
      const gMinusPos = {
        x: filmW*0.8+effectsBarW/2,
        y: effectsBarH*4,
        w: effectsBarW/2,
        h: effectsBarH
      };
      const bPlusPos = {
        x: filmW*0.8,
        y: effectsBarH*5,
        w: effectsBarW/2-1,
        h: effectsBarH
      };
      const bMinusPos = {
        x: filmW*0.8+effectsBarW/2,
        y: effectsBarH*5,
        w: effectsBarW/2,
        h: effectsBarH
      };
      const salvareCadruPos = {
        x: filmW*0.8,
        y: effectsBarH*6,
        w: effectsBarW,
        h: effectsBarH
      };

      //Verificam daca mouse-ul este pozitionat in cadranul corespunzator

      if (previousPos.x<userClickCoords.x&&(previousPos.x+previousPos.w)>userClickCoords.x && 
      previousPos.y<userClickCoords.y && (previousPos.y+previousPos.h) > userClickCoords.y){
            goToThePrev();
      }
      if (playPos.x<userClickCoords.x&&(playPos.x+playPos.w)>userClickCoords.x && 
      playPos.y<userClickCoords.y && (playPos.y+playPos.h) > userClickCoords.y){
            playCurrentVideo();
      }
      if (stopPos.x<userClickCoords.x&&(stopPos.x+stopPos.w)>userClickCoords.x && 
      stopPos.y<userClickCoords.y && (stopPos.y+stopPos.h) > userClickCoords.y){
            stopCurrentVideo();
      }
      if (nextPos.x<userClickCoords.x&&(nextPos.x+nextPos.w)>userClickCoords.x && 
      nextPos.y<userClickCoords.y && (nextPos.y+nextPos.h) > userClickCoords.y){
            goToTheNext();
      }
      if (albNegruPos.x<userClickCoords.x&&(albNegruPos.x+albNegruPos.w)>userClickCoords.x && 
      albNegruPos.y<userClickCoords.y && (albNegruPos.y+albNegruPos.h) > userClickCoords.y){
            makeTheVideoAlbNegru();
      }
      if (sepiaPos.x<userClickCoords.x&&(sepiaPos.x+sepiaPos.w)>userClickCoords.x && 
      sepiaPos.y<userClickCoords.y && (sepiaPos.y+sepiaPos.h) > userClickCoords.y){
            makeTheVideoSepia();
      }

      if (negativPos.x<userClickCoords.x&&(negativPos.x+negativPos.w)>userClickCoords.x && 
      negativPos.y<userClickCoords.y && (negativPos.y+negativPos.h) > userClickCoords.y){
            makeTheVideoNegativ();
      }

      if (rPlusPos.x<userClickCoords.x&&(rPlusPos.x+rPlusPos.w)>userClickCoords.x && 
      rPlusPos.y<userClickCoords.y && (rPlusPos.y+rPlusPos.h) > userClickCoords.y){
        if(rgb.r<250){
          rgb.r += 5;
        }
      }
      if (rMinusPos.x<userClickCoords.x&&(rMinusPos.x+rMinusPos.w)>userClickCoords.x && 
      rMinusPos.y<userClickCoords.y && (rMinusPos.y+rMinusPos.h) > userClickCoords.y){
        if(rgb.r>5){
          rgb.r -= 5;
        }
      }

      if (gPlusPos.x<userClickCoords.x&&(gPlusPos.x+gPlusPos.w)>userClickCoords.x && 
      gPlusPos.y<userClickCoords.y && (gPlusPos.y+rPlusPos.h) > userClickCoords.y){
        if(rgb.g<250){
          rgb.g += 5;
        }
      }
      if (gMinusPos.x<userClickCoords.x&&(gMinusPos.x+gMinusPos.w)>userClickCoords.x && 
      gMinusPos.y<userClickCoords.y && (gMinusPos.y+gMinusPos.h) > userClickCoords.y){
        if(rgb.g>5){
          rgb.g -= 5;
        }
      }

      if (bPlusPos.x<userClickCoords.x&&(bPlusPos.x+bPlusPos.w)>userClickCoords.x && 
      bPlusPos.y<userClickCoords.y && (bPlusPos.y+bPlusPos.h) > userClickCoords.y){
        if(rgb.b<250){
          rgb.b += 5;
        }
      }
      if (bMinusPos.x<userClickCoords.x&&(bMinusPos.x+bMinusPos.w)>userClickCoords.x && 
      bMinusPos.y<userClickCoords.y && (bMinusPos.y+bMinusPos.h) > userClickCoords.y){
        if(rgb.b>5){
          rgb.b -= 5;
        }
      }
      if (salvareCadruPos.x<userClickCoords.x&&(salvareCadruPos.x+salvareCadruPos.w)>userClickCoords.x && 
      salvareCadruPos.y<userClickCoords.y && (salvareCadruPos.y+salvareCadruPos.h) > userClickCoords.y){
            salvareCadru();
      }
      if (CCPos.x<userClickCoords.x&&(CCPos.x+CCPos.w)>userClickCoords.x && 
      CCPos.y<userClickCoords.y && (CCPos.y+CCPos.h) > userClickCoords.y){
            CCTurnedOn();
      }
    });
  
  var isAlbNegru = false;
  var isSepia = false;
  var isNegativ = false;
  var ccON = false;
  var rgb = {
    r:0,
    g:0,
    b:0
  };
  var sepiaR=null;
  fetch('lib/r.txt')
  .then(response => response.text())
  .then(text => {
    sepiaR = text.split(', ').map((element)=>parseInt(element));
  });
  var sepiaG=null;
  fetch('lib/g.txt')
  .then(response => response.text())
  .then(text => {
    sepiaG = text.split(', ').map((element)=>parseInt(element));
  });
  var sepiaB=null;
  fetch('lib/b.txt')
  .then(response => response.text())
  .then(text => {
    sepiaB = text.split(', ').map((element)=>parseInt(element));
  });
  var video = document.getElementById("video1");
  var currentJSON = null;
  function repeatDrawingVidFrame(){
      //Desenare cadrului curent in canvas
      filmCtx.drawImage(video,0,0,filmW*0.8,filmH*0.9);
      //Preluarea imaginii, respectiv al pixelilor din cadrul curent
      var imgDt = filmCtx.getImageData(0,0,filmW*0.8,filmH*0.9);
      var pxls = imgDt.data;
      //Vectorii pentru fiecare pixel RGBA in parte
      var mediaRGBA = [0,0,0,0];
      var numarPXLS = filmH * 0.9 * filmW*0.8;
      for(var y=0; y<filmH*0.9;y++){
          for (var x = 0; x < filmW*0.8; x++) {
            //Preluarea pozitiei curente din vectorul de pixeli
            var i = (y * filmW*0.8 * 4) + x * 4;
            //Aplicarea efectelor alb/negru, sepia si negativ
            if (isAlbNegru){
              mean = pxls[i] * 0.2126 + pxls[i+1] * 0.7152 + pxls[i+2] * 0.0722;
              pxls[i] = pxls[i+1] = pxls[i+2] = mean;
            }
            if (isSepia){
              pxls[i] = sepiaR[pxls[i]];
              pxls[i+1] = sepiaG[pxls[i]];
              pxls[i+2] = sepiaB[pxls[i]];
            }
            if (isNegativ){
              pxls[i] = 255 - pxls[i];
              pxls[i+1] = 255 - pxls[i+1];
              pxls[i+2] = 255 - pxls[i+2];
            }
            //In cazul in care utilizatorul mareste sau scade compozitia rgb
            pxls[i] += rgb.r;
            pxls[i+1] += rgb.g;
            pxls[i+2] += rgb.b;
            mediaRGBA[0] += pxls[i];
            mediaRGBA[1] += pxls[i+1];
            mediaRGBA[2] += pxls[i+2];
            mediaRGBA[3] += pxls[i+3];
          }
      }
      //Desenarea imaginii modificate dupa caz din nou in canvasul filmului
      filmCtx.putImageData(imgDt,0,0);
      //Desenarea progres barului
      //Stim ca avem la chenarul filmului line Width de 5!!!
      var progressX = 0; //de unde incepe noul X
      var progressY = filmH*0.9-5; //Chenarul filmului se termina la filmH*0.9 si scadem lineWidth
      filmCtx.strokeStyle = "red";
      filmCtx.lineWidth = 10;
      var progressLength = (filmW*0.8-5)/video.duration;//chenarul are filmW*0.8 width -5 de la lineWidth din dreapta
      filmCtx.beginPath();
      filmCtx.moveTo(progressX,progressY);
      filmCtx.lineTo(video.currentTime*progressLength,progressY);
      filmCtx.stroke();
      filmCtx.closePath();
      //Calcularea mediei pe fiecare componenta RGB
      for (var i=0;i<mediaRGBA.length;i++){
        mediaRGBA[i] = mediaRGBA[i]/numarPXLS;
      }
      if (currentVideo == 0) {
        fetch(videosCCs[currentVideo])
        .then(response => response.text())
        .then(text => {
          currentJSON = JSON.parse(text);
        });
      }else{
        currentJSON = null;
      }
      if(currentJSON !=null && ccON){
        for(var i=0;i<currentJSON.subtitles.length;i++){
          if(parseFloat(currentJSON.subtitles[i].start) < video.currentTime &&
             video.currentTime < parseFloat(currentJSON.subtitles[i].stop)){
              filmCtx.font = "20px Georgia";
              filmCtx.fillStyle = "white";
              filmCtx.fillText(currentJSON.subtitles[i].text,filmW*0.3,filmH*0.8);
          }
        }
      }
      //Desenarea histogramei
      //Redesenarea histogramei pt fiecare cadru
      histogramCtx.fillStyle = "rgba(198, 172, 143,1)";
      histogramCtx.fillRect(0,0,histogramW,histogramH);
      //Desenarea textului pentru fiecare din cele 4 bare
      histogramCtx.font = "20px Georgia";
      histogramCtx.fillStyle = "red";
      histogramCtx.fillText("rMEAN",0.1*histogramW/4,20);

      histogramCtx.fillStyle = "green";
      histogramCtx.fillText("gMEAN",(1+0.1)*histogramW/4,20);

      histogramCtx.fillStyle = "blue";
      histogramCtx.fillText("bMEAN",(2+0.1)*histogramW/4,20);

      histogramCtx.fillStyle = "black";
      histogramCtx.fillText("opacityMEAN",(3+0.1)*histogramW/4,20);

      //Desenarea efectiva a barelor din histograma pentru fiecare bara
      histogramCtx.fillStyle = "rgba(82, 73, 72,1)";
      histogramCtx.strokeStyle = "rgba(82, 73, 72,1)";
      var procentaj = histogramH*0.9 / Math.max.apply(Math, mediaRGBA);
      for (var k = 0;k<mediaRGBA.length;k++){
          histogramCtx.fillRect((k + 0.1)*(histogramW / mediaRGBA.length) ,histogramH - mediaRGBA[k]*procentaj,
          0.8*(histogramW / mediaRGBA.length),mediaRGBA[k]*procentaj);
      }
      requestAnimationFrame(repeatDrawingVidFrame);
  };
  repeatDrawingVidFrame()
  video.addEventListener('ended', function(e){
    goToTheNext();
  });
  function playCurrentVideo(){
      video.play();
  };
  function stopCurrentVideo(){
      video.pause();
  };
  function goToThePrev(){
     if (currentVideo == 0){
        currentVideo = videosPaths.length-1;
      }else{
        currentVideo -= 1;
     }
     video.setAttribute('src',videosPaths[currentVideo]);
      playCurrentVideo();
  };
  function goToTheNext(){
      if (currentVideo == videosPaths.length-1){
         currentVideo = 0;
     }else{
        currentVideo += 1;
      }
      video.setAttribute('src',videosPaths[currentVideo]);
     playCurrentVideo();
  };
  function makeTheVideoAlbNegru(){
    if (isAlbNegru){
      isAlbNegru = false;
    }else{
      isAlbNegru = true;
    }
  }
  function makeTheVideoSepia(){
    if(isSepia){
      isSepia = false;
    }else{
      isSepia = true;
    }
  }
  function makeTheVideoNegativ(){
    if(isNegativ){
      isNegativ = false;
    }else{
      isNegativ = true;
    }
  }
  function CCTurnedOn(){
    if(currentJSON == null){
      alert('Nu exista subtitare pentru acest film!');
    }
    if(ccON){
      ccON = false;
    }else{
      ccON = true;
    }
  }
  function salvareCadru(){
      var dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = filmW*0.8;
      dummyCanvas.height = filmH*0.9;
      dummyCanvas.getContext("2d").drawImage(video,0,0,filmW*0.8,filmH*0.9);
      var urlLink = dummyCanvas.toDataURL("image/png");

      var img = new Image();
      img.src = urlLink;
      var newWindow = window.open();
      newWindow.document.write(img.outerHTML);
  }
});