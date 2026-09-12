import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js/dist/wavesurfer.esm.js";

const trackList = [
  {title:"Half Step from Heaven", filePath:  "./assets/audio/Half Step from Heaven wav.mp3"},
  {title:"Bleed for You", filePath: "./assets/audio/Bleed fo you 24.mp3"},
  {title:"Last Day", filePath:"./assets/audio/Last Day.mp3"},
  {title:"RISE", filePath:"./assets/audio/RISE.mp3"},
  {title:"Tears Fall", filePath:"./assets/audio/Tears Fall.mp3"},
  {title:"Where is the Love", filePath: "./assets/audio/Where is the Love.mp3"},
];

let currentTrackIndex = 0;
let trackReady = false;
let loadStarted = false;
let playAfterLoad = false;

if (window.location.protocol === "file:") {
  const title = document.getElementById("trackTitle");
  if (title) {
    title.innerText = "Open via http://localhost:8080 to play music (not by double-clicking index.html)";
  }
}

const wavesurfer1 = WaveSurfer.create({
    container: '#waveform1',
    waveColor: 'rgb(0,51,255)',
    progressColor: 'rgb(100, 0, 100)',
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    height:110,
    audioRate: 1,
    cursorWidth: 2,
  });

const playPauseButton = document.getElementById("playPause1");

function playButtonParts() {
  return {
    icon: playPauseButton.querySelector("i"),
    textElement: playPauseButton.nextElementSibling,
  };
}

function resetPlayButton() {
  const { icon, textElement } = playButtonParts();
  icon.classList.remove("bi-pause-fill");
  icon.classList.add("bi-play-fill");
  textElement.innerText = "Play";
}

function setPlayingButton() {
  const { icon, textElement } = playButtonParts();
  icon.classList.remove("bi-play-fill");
  icon.classList.add("bi-pause-fill");
  textElement.innerText = "Pause";
}

wavesurfer1.on('ready', () => {
  trackReady = true;
  if (playAfterLoad) {
    playAfterLoad = false;
    wavesurfer1.play().then(setPlayingButton).catch((err) => {
      console.error("Playback failed:", err);
      resetPlayButton();
    });
  }
});

wavesurfer1.on('error', (err) => {
  trackReady = false;
  playAfterLoad = false;
  console.error('WaveSurfer error:', err);
});

function loadTrack(index){
  const track = trackList[index];
  if(!track){
    return;
  }
  trackReady = false;
  loadStarted = true;
  wavesurfer1.pause();
  wavesurfer1.load(encodeURI(track.filePath));
  document.getElementById("trackTitle").innerText = track.title;
}

function ensureCurrentTrackLoaded() {
  if (!loadStarted) {
    loadTrack(currentTrackIndex);
  }
}

playPauseButton.addEventListener("click", function () {
  if (wavesurfer1.isPlaying()) {
    wavesurfer1.pause();
    resetPlayButton();
    return;
  }

  if (!loadStarted || !trackReady) {
    playAfterLoad = true;
    ensureCurrentTrackLoaded();
    return;
  }

  wavesurfer1.play().then(setPlayingButton).catch((err) => {
    console.error("Playback failed:", err);
    resetPlayButton();
  });
});

document.getElementById('nextTrack').addEventListener('click', () => {
  playAfterLoad = false;
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  resetPlayButton();
  loadTrack(currentTrackIndex);
});

document.getElementById("prevTrack").addEventListener("click", () => {
  playAfterLoad = false;
  currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
  resetPlayButton();
  loadTrack(currentTrackIndex);
});

const playerEl = document.getElementById("music-player");
if (playerEl && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      ensureCurrentTrackLoaded();
      observer.disconnect();
    }
  }, { rootMargin: "200px" });
  observer.observe(playerEl);
} else {
  ensureCurrentTrackLoaded();
}
