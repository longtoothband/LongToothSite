import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js/dist/wavesurfer.esm.js";

// Track list
// Using an array to store the list of tracks
const trackList = [
  {title:"Bleed for You", filePath: "/assets/audio/Bleed fo you 24.mp3"},
  {title:"Half Step from Heaven", filePath:  "/assets/audio/Half Step from Heaven wav.mp3"},
  {title:"Last Day", filePath:"/assets/audio/Last Day.mp3"},
];

//Set tracks current index 
let currentTrackIndex = 0;

// Wavesurfer
const wavesurfer1 = WaveSurfer.create({
    container: '#waveform1',
    waveColor: 'rgb(200, 0, 200)',  // Waveform color
    progressColor: 'rgb(100, 0, 100)', // Progress color
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    height:110,
    audioRate: 1,
    cursorWidth: 2,
    
  });

  wavesurfer1.on('loading', (percent) => {
    console.log('Loading', percent + '%')
  })

  // Need a function to load and play a specific track based on it's index
  function loadTrack(index){
    const track = trackList[index];
    if(track){
      wavesurfer1.load(track.filePath);
      document.getElementById("trackTitle").innerText = track.title;
      wavesurfer1.on("ready", ()=>{
        wavesurfer1.play();
        const playPauseIcon = document.getElementById("playPause1").querySelector("i");
        playPauseIcon.classList.remove("bi-play-fill");
        playPauseIcon.classList.add("bi-pause-fill");
      });

    }
  }

  
// Play/Pause Button
document.getElementById("playPause1").addEventListener("click", function () {
  const icon = this.querySelector("i");
  if (wavesurfer1.isPlaying()) {
    wavesurfer1.pause();
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
  } else {
    wavesurfer1.play();
    icon.classList.remove("bi-play-fill");
    icon.classList.add("bi-pause-fill");
  }
});

  document.getElementById('nextTrack').addEventListener('click', () => {
    console.log("Next track was clicked");
    currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
    loadTrack(currentTrackIndex);
  });

  // Add functionality for next/previous buttons
document.getElementById("prevTrack").addEventListener("click", () => {
  console.log("Previous track was clicked");
  currentTrackIndex = (currentTrackIndex - 1) + trackList.length;
  loadTrack(currentTrackIndex);
  
});


// Initialize First Track
document.addEventListener("DOMContentLoaded", () => {
  loadTrack(currentTrackIndex);
});


