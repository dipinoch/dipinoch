let video;
let button;
var fps = 30;

//capturer instace
var capturer = new CCapture({ format: 'png', framerate: fps });

function setup() {
  createCanvas(640, 480);
  background(51);
  frameRate(fps);

  video = createCapture(VIDEO); //access live webcam
  video.size(640, 480); //change the size to 320 x 240
  button = createButton('snap'); //create a button called "snap"
  button.mousePressed(takesnap); //when the button is pressed, call the function called "takesnap"
  savedTime = millis(); // since we've put this inside setup(), millis() stops running once draw() begins
}

function takesnap() {
  image(video, 0, 0); //draw the image being captured on webcam onto the canvas at the position (0, 0) of the canvas
}



function draw() {
    if (frameCount === 60) {
        capturer.start();
    }

    let passedTime = millis() - savedTime;
    console.log(passedTime);
    takesnap();

   // if we have passed t=1 then end the animation.
   if (passedTime > 15000) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  } 
   // handle saving the frame
   console.log('capturing frame');
   capturer.capture(document.getElementById('defaultCanvas0'));
}
