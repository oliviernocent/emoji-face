let mode = "realism";
let selectMode;

let shuffleButton;

let emoji = [];
let face = [];

let poseNet, poses = [];
/*
Keypoint label

 0 nose
 1 leftEye
 2 rightEye
 3 leftEar
 4 rightEar
 5 leftShoulder
 6 rightShoulder
 7 leftElbow
 8 rightElbow
 9 leftWrist
10 rightWrist
11 leftHip
12 rightHip
13 leftKnee
14 rightKnee
15 leftAnkle
16 rightAnkle

*/

function preload() {
  let filename = [
    "octopus.png",
    "alarm-clock.png",
    "alien-monster.png",
    "basketball.png",
    "bear-face.png",
    "billiards.png",
    "bomb.png",
    "cat-face.png",
    "clown-face.png",
    "cow-face.png",
    "dog-face.png",
    "dragon-face.png",
    "extraterrestrial-alien.png",
    "fox-face.png",
    "frog-face.png",
    "game-die.png",
    "hamster-face.png",
    "koala-face.png",
    "lion-face.png",
    "monkey-face.png",
    "mouse-face.png",
    "musical-keyboard.png",
    "package.png",
    "panda-face.png",
    "pig-face.png",
    "pile-of-poo.png",
    "rabbit-face.png",
    "robot-face.png",
    "skull.png",
    "television.png",
    "tiger-face.png"
  ];

  for (let file of filename) {
    let img1 = loadImage("img/emoji/flat/" + file);
    let img2 = loadImage("img/emoji/realism/" + file);

    emoji.push({ flat: img1, realism: img2 });
  }
}

function setup() {
  selectMode = select("#mode");
  selectMode.changed(changeMode);

  shuffleButton = select("#shuffle-button");
  shuffleButton.mousePressed(shuffleFaces);

  let canvas = createCanvas(640, 480);
  canvas.parent("canvas");

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, "single", modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;

    for (let i=0; i<poses.length; i++) {
      if (face[i] === undefined) {
        face[i] = Math.floor(Math.random() * emoji.length);
      }
    }
  });

  colorMode(RGB, 255, 255, 255, 1);
}

function draw() {
  imageMode(CORNER);
  image(capture, 0, 0, 640, 480);

  for (let i=0; i<poses.length; i++) {
    let p1 = poses[i].pose.keypoints[2].position;
    let p2 = poses[i].pose.keypoints[1].position;

    let v = createVector(p2.x - p1.x, p2.y - p1.y);
    let l = v.mag();
    let angle = v.heading();

    push()
    translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    rotate(angle);
    imageMode(CENTER);
    image(emoji[face[i]][mode], 0, 0, l * 5, l * 5);
    pop();
  }
}

function modelReady() {
  console.log("Model ready...");
}

function changeMode() {
  mode = selectMode.value();
}

function shuffleFaces() {
  face = [];
  for (let i=0; i<poses.length; i++) {
    if (face[i] === undefined) {
      face[i] = Math.floor(Math.random() * emoji.length);
    }
  }
}
