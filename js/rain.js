//creating a scene
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, //aspect ratio
  0.1, //near clipping plane
  1000 //far clipping plane
);

//set camera position on z axis
camera.position.z = 60;

//instance of renderer, to allocate space on webpage to do our 3d stuff
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");

//set the size of space, here using windows inner width and height properties to take full page.
renderer.setSize(window.innerWidth, window.innerHeight);

//now to inject that space on to the page
document.body.appendChild(renderer.domElement);

//make window responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

//adding bg
var texture_bg = new THREE.TextureLoader().load("bg2.jpg", () => {
  scene.background = texture_bg;
});

// Rain

function Rain() {
  let vertices;
  for (let i = 0; i < 20; i++) {
    vertices = [];
    x = Math.random() * 400 - 200;
    y = Math.random() * 400 - 200;
    vertices.push(new THREE.Vector3(x, y, 0));
    vertices.push(new THREE.Vector3(x, y - 1.5, 0));

    var geometry = new THREE.Geometry().setFromPoints(vertices);

    var material = new THREE.LineBasicMaterial({ color: "#808080" });
    var line_obj = new THREE.Line(geometry, material);
    line_obj.name = "lines";
    scene.add(line_obj);
  }
}

function singleCloud() {
  const group = new THREE.Group();

  x = 0;
  y = 0;

  const intervals = (2.0 * Math.PI) / 8;

  var geometry = new THREE.CircleGeometry(
    5, // circle radius
    32 // segments
  );

  // custom material
  var material = new THREE.MeshBasicMaterial({
    color: "#D3D3D3",
    side: THREE.DoubleSide,
  });

  // for placing the cloud's circles

  for (let i = 0; i < 8; i++) {
    const circle = new THREE.Mesh(geometry, material);

    if (i == 0 || i == 4) {
      circle.position.set(
        Math.cos(intervals * i) * 9 + x, // 9 is radius for 0th and 4th circle
        Math.sin(intervals * i) * 9 + y,
        0
      );
    } else {
      circle.position.set(
        Math.cos(intervals * i) * 5 + x, // 5 is radius for rest of the circles
        Math.sin(intervals * i) * 5 + y,
        0
      );
    }
    // add the circle to the group
    group.add(circle);
  }
  scene.add(group);
  return group;
}

function removeRain() {
  for (i = 0; i < 19; ++i) {
    scene.remove(scene.getObjectByName("lines"));
  }
}

function moveClouds() {
  for (let i = 0; i < 15; i += 2) {
    scene.getObjectByName("circles" + i).position.x += speed;
  }
  for (let i = 1; i < 15; i += 2) {
    scene.getObjectByName("circles" + i).position.x -= speed;
  }
}

function Clouds() {
  for (let i = 0; i < 15; i++) {
    group = singleCloud();
    group.name = "circles" + i;

    //setting random positions for clouds
    x = Math.random() * 200 - 100;
    scene.getObjectByName(group.name).position.set(x, 37, 0);
  }
}

var speed = 0.08;
setInterval(() => {
  speed *= -1;
}, 30000); // multiplying speed to -1 to reverse the clouds

// background sound

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("daisy.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(3);
  sound.play();
});

// foreground sound

const foregroung_sound = new THREE.Audio(listener);

audioLoader.load("1.mp3", function (buffer) {
  foregroung_sound.setBuffer(buffer);
  foregroung_sound.setLoop(true);
  foregroung_sound.setVolume(1.5);
  foregroung_sound.play();
});

// thunder

const thunder_sound = new THREE.Audio(listener);

audioLoader.load("thunderclap.ogg", function (buffer) {
  thunder_sound.setBuffer(buffer);
  thunder_sound.setLoop(false);
  thunder_sound.setVolume(11);
});

document.addEventListener("click", function () {
  audioLoader.load("thunderclap.ogg", function (buffer) {
    thunder_sound.play();
  });
});

var render = function () {
  requestAnimationFrame(render); //to create a loop to render ui repeatedly after page is refreshed
  Rain();
  removeRain();
  moveClouds();
  renderer.render(scene, camera);
};

Clouds();
render();
