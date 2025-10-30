let mode = "realism";

let emoji = [];
let face = [];

let capture;
let bodyPose, poses = [];

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

// When the model is loaded
function modelLoaded() {
  document.querySelector("span").style.display = "none";

  // Start detecting poses in the webcam video
  bodyPose.detectStart(capture, gotPoses);
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas");

  colorMode(RGB, 255, 255, 255, 1);

  let constraints = {
    video: {
      facingMode: "user", // "user", "environment",
      width: windowWidth,
      aspectRatio: windowWidth / windowHeight
    },
    audio: false,
  };
  capture = createCapture(constraints, { flipped: true }, () => {
    // Load the bodyPose model
    let poseOptions = {
      modelType: "MULTIPOSE_LIGHTNING", // "MULTIPOSE_LIGHTNING", "SINGLEPOSE_LIGHTNING", or "SINGLEPOSE_THUNDER".
      enableSmoothing: true,
      minPoseScore: 0.25,
      multiPoseMaxDimension: 256,
      enableTracking: true,
      trackerType: "boundingBox", // "keypoint" or "boundingBox"
      trackerConfig: {},
      modelUrl: undefined,
      flipped: false,
    };
    bodyPose = ml5.bodyPose(poseOptions, modelLoaded);
  });
  capture.hide();

}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  poses = results;

  for (let i = 0; i < poses.length; i++) {
    if (face[i] === undefined) {
      face[i] = Math.floor(Math.random() * emoji.length);
    }
  }
}

function draw() {  
  background(77, 148, 255);
  imageMode(CORNER);
  image(capture, 0, 0);

  for (let i = 0; i < poses.length; i++) {
    let p1 = poses[i].right_ear;
    let p2 = poses[i].left_ear;

    let v = createVector(p2.x - p1.x, p2.y - p1.y);
    let l = v.mag();
    let angle = v.heading();

    push()
    translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    rotate(angle);
    imageMode(CENTER);
    image(emoji[face[i]][mode], 0, -l * 0.1, l * 2.5, l * 2.5);
    pop();
  }
}

function shuffleFaces() {
  face = [];
  for (let i = 0; i < poses.length; i++) {
    if (face[i] === undefined) {
      face[i] = Math.floor(Math.random() * emoji.length);
    }
  }
}
