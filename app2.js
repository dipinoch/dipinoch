let video;
let button;


function setup() {
  createCanvas(320, 240);
  background(51);
  video = createCapture(VIDEO); //access live webcam
  video.size(320, 240); //change the size to 320 x 240
  button = createButton('snap'); //create a button called "snap"
  button.mousePressed(takesnap); //when the button is pressed, call the function called "takesnap"
  
}

function takesnap() {
  image(video, 0, 0); //draw the image being captured on webcam onto the canvas at the position (0, 0) of the canvas
}



function draw() {

  //image(video, 0, 0); 
  
  
  
}
