// === THREE.JS SETUP ===
let scene, camera, renderer, avatar, mixer, actions;
const loader = new THREE.GLTFLoader();

// Init on load
window.addEventListener('load', init);

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('canvas').appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Load avatar
  loader.load(
    'assets/models/del.glb',
    (gltf) => {
      avatar = gltf.scene;
      avatar.scale.set(1.2, 1.2, 1.2);
      avatar.position.set(0, 0, 0);
      scene.add(avatar);

      // Animation system
      mixer = new THREE.AnimationMixer(avatar);
      actions = {};
      gltf.animations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });

      // Play idle animation
      playAnimation('Idle');
    },
    (progress) => console.log(`Loading: ${Math.round(progress.loaded / progress.total * 100)}%`),
    (error) => {
      console.error("Error loading model:", error);
      alert("Failed to load 3D model. Check 'assets/models/del.glb'");
    }
  );

  // Start animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}

// === ANIMATION CONTROLS ===
function playAnimation(name) {
  if (!mixer || !actions[name]) return;
  mixer.stopAllAction();
  actions[name].play();
}

// === SPEECH SYNTHESIS ===
const synth = window.speechSynthesis;

function speak(text) {
  if (synth.speaking) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const ukVoice = voices.find(v => v.lang === 'en-GB') || voices[0];

  utterance.voice = ukVoice;
  utterance.rate = 0.9;
  utterance.pitch = 0.7;

  utterance.onstart = () => playAnimation('Talking');
  utterance.onend = () => playAnimation('Idle');

  synth.speak(utterance);
}

// === DIAGNOSIS LOGIC ===
function diagnose() {
  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = document.getElementById("year").value.trim();
  const symptom = document.getElementById("symptom").value.trim().toLowerCase();

  if (!make || !model || !year || !symptom) {
    alert("Fill in all fields, guv'nor!");
    return;
  }

  // React based on symptom
  if (symptom.includes("brake")) {
    playAnimation('PointLeft');
    speak("STOP! Brakes are dodgy? Check the fluid, pads, and lines — don't drive it, son!");
  } else if (symptom.includes("start")) {
    playAnimation('Wave');
    speak(`Ah, won't start? Could be fuel pump, battery, or immobilizer, innit?`);
  } else if (symptom.includes("noise") || symptom.includes("knock")) {
    playAnimation('ScratchHead');
    setTimeout(() => {
      speak("Sounds like a bearing or timing chain. Give it a listen near the engine.");
    }, 1000);
  } else {
    playAnimation('Idle');
    speak(`Let old Del 'ave a think about that ${symptom}...`);
  }

  // Show results
  document.getElementById("causes").innerHTML = `
    <li>Check fluid levels and leaks</li>
    <li>Inspect belts and hoses</li>
    <li>Scan for OBD2 error codes</li>
    <li>Test battery and alternator</li>
    <li>Inspect for loose or damaged parts</li>
  `;

  const query = encodeURIComponent(`${make} ${model} ${year} ${symptom} fix`);
  document.getElementById("video-link").href = `https://www.youtube.com/results?search_query=${query}`;
  document.getElementById("results").style.display = "block";
}

// Load voices
synth.onvoiceschanged = () => console.log("Voices loaded");