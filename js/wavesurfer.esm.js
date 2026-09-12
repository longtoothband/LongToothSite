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

wavesurfer1.on('ready', () => {
  trackReady = true;
});

wavesurfer1.on('error', (err) => {
  trackReady = false;
  console.error('WaveSurfer error:', err);
});

function loadTrack(index){
  const track = trackList[index];
  if(!track){
    return;
  }
  trackReady = false;
  wavesurfer1.load(encodeURI(track.filePath));
  document.getElementById("trackTitle").innerText = track.title;
}

function resetPlayButton(icon, textElement) {
  icon.classList.remove("bi-pause-fill");
  icon.classList.add("bi-play-fill");
  textElement.innerText = "Play";
}

document.getElementById("playPause1").addEventListener("click", function () {
  const icon = this.querySelector("i");
  const textElement = this.nextElementSibling;
  if (wavesurfer1.isPlaying()) {
    wavesurfer1.pause();
    resetPlayButton(icon, textElement);
    return;
  }

  if (!trackReady) {
    return;
  }

  wavesurfer1.play().then(() => {
    icon.classList.remove("bi-play-fill");
    icon.classList.add("bi-pause-fill");
    textElement.innerText = "Pause";
  }).catch((err) => {
    console.error("Playback failed:", err);
    resetPlayButton(icon, textElement);
  });
});

document.getElementById('nextTrack').addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  loadTrack(currentTrackIndex);
  const playPause = document.getElementById("playPause1");
  resetPlayButton(playPause.querySelector("i"), playPause.nextElementSibling);
});

document.getElementById("prevTrack").addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
  loadTrack(currentTrackIndex);
  const playPause = document.getElementById("playPause1");
  resetPlayButton(playPause.querySelector("i"), playPause.nextElementSibling);
});

function initFirstTrack() {
  loadTrack(currentTrackIndex);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirstTrack);
} else {
  initFirstTrack();
}
