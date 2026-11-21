import WaveSurfer from "https://cdn.jsdelivr.net/npm/wavesurfer.js/dist/wavesurfer.esm.js";

const tracks = [
  { title: "Half Step from Heaven", filePath: "./assets/audio/Half Step from Heaven wav.mp3", duration: 316.656 },
  { title: "Bleed for You", filePath: "./assets/audio/Bleed fo you 24.mp3", duration: 364.368 },
  { title: "Last Day", filePath: "./assets/audio/Last Day.mp3", duration: 279.384 },
  { title: "RISE", filePath: "./assets/audio/RISE.mp3", duration: 342.036 },
  { title: "Tears Fall", filePath: "./assets/audio/Tears Fall.mp3", duration: 211.068 },
  { title: "Where is the Love", filePath: "./assets/audio/Where is the Love.mp3", duration: 286.092 },
];

let currentTrackIndex = 0;
let trackReady = false;
let loadStarted = false;
let playAfterLoad = false;
let isSeeking = false;
let boundMedia = null;

const titleEl = document.getElementById("trackTitle");
const timeEl = document.getElementById("trackTime");
const durationEl = document.getElementById("trackDuration");
const trackListEl = document.getElementById("listenTrackList");
const progressEl = document.getElementById("trackProgress");
const playPauseButton = document.getElementById("playPause1");

if (window.location.protocol === "file:") {
  if (titleEl) {
    titleEl.innerText = "Open via http://localhost:8080 to play music (not by double-clicking index.html)";
  }
}

function playButtonParts() {
  return {
    icon: playPauseButton.querySelector("i"),
    textElement: playPauseButton.nextElementSibling,
  };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getMedia() {
  if (typeof wavesurfer1.getMediaElement === "function") {
    return wavesurfer1.getMediaElement();
  }
  return boundMedia;
}

function getTimes() {
  const media = getMedia();
  const current = media && Number.isFinite(media.currentTime) ? media.currentTime : wavesurfer1.getCurrentTime();
  const mediaDuration = media && Number.isFinite(media.duration) && media.duration > 0 ? media.duration : null;
  const duration = mediaDuration || wavesurfer1.getDuration();
  return { current, duration };
}

function updateProgressUi() {
  const { current, duration } = getTimes();
  if (timeEl) {
    timeEl.textContent = formatTime(current);
  }
  if (durationEl) {
    durationEl.textContent = formatTime(duration);
  }
  if (!progressEl || isSeeking) {
    return;
  }
  const ratio = Number.isFinite(duration) && duration > 0 ? Math.min(current / duration, 1) : 0;
  progressEl.value = String(Math.round(ratio * 1000));
  progressEl.style.setProperty("--progress", `${ratio * 100}%`);
}

function cacheDuration() {
  const { duration } = getTimes();
  if (Number.isFinite(duration) && duration > 0) {
    tracks[currentTrackIndex].duration = duration;
    renderTrackList();
  }
}

function resetPlayButton() {
  const { icon, textElement } = playButtonParts();
  icon.classList.remove("bi-pause-fill");
  icon.classList.add("bi-play-fill");
  playPauseButton.setAttribute("aria-label", "Play");
  if (textElement) {
    textElement.innerText = "Play";
  }
}

function setPlayingButton() {
  const { icon, textElement } = playButtonParts();
  icon.classList.remove("bi-play-fill");
  icon.classList.add("bi-pause-fill");
  playPauseButton.setAttribute("aria-label", "Pause");
  if (textElement) {
    textElement.innerText = "Pause";
  }
}

function renderTrackList() {
  if (!trackListEl) {
    return;
  }
  trackListEl.replaceChildren();
  tracks.forEach((track, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "listen-track" + (index === currentTrackIndex ? " is-current" : "");
    const indicator = document.createElement("span");
    indicator.className = "listen-track-indicator";
    indicator.setAttribute("aria-hidden", "true");
    const num = document.createElement("span");
    num.className = "listen-track-num";
    num.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "listen-track-title";
    name.textContent = track.title;
    const time = document.createElement("span");
    time.className = "listen-track-time";
    time.textContent = track.duration ? formatTime(track.duration) : "--:--";
    button.append(indicator, num, name, time);
    button.addEventListener("click", () => {
      if (index === currentTrackIndex && loadStarted) {
        return;
      }
      playAfterLoad = false;
      currentTrackIndex = index;
      resetPlayButton();
      loadTrack(currentTrackIndex);
    });
    item.appendChild(button);
    trackListEl.appendChild(item);
  });
}

function bindMedia(media) {
  if (!media || media === boundMedia) {
    return;
  }
  boundMedia = media;
  media.addEventListener("loadedmetadata", () => {
    trackReady = true;
    cacheDuration();
    updateProgressUi();
  });
  media.addEventListener("durationchange", () => {
    cacheDuration();
    updateProgressUi();
  });
  media.addEventListener("canplay", () => {
    trackReady = true;
  });
  media.addEventListener("timeupdate", updateProgressUi);
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track) {
    return;
  }
  trackReady = false;
  loadStarted = true;
  wavesurfer1.pause();
  wavesurfer1.load(encodeURI(track.filePath));
  if (titleEl) {
    titleEl.innerText = track.title;
  }
  renderTrackList();
  updateProgressUi();
  bindMedia(getMedia());
}

function ensureCurrentTrackLoaded() {
  if (!loadStarted) {
    loadTrack(currentTrackIndex);
  }
}

renderTrackList();

const wavesurfer1 = WaveSurfer.create({
  container: "#waveform1",
  waveColor: "rgba(243, 246, 251, 0.28)",
  progressColor: "rgba(243, 246, 251, 0.92)",
  cursorColor: "#ffffff",
  height: 1,
  cursorWidth: 0,
  interact: false,
  fillParent: true,
});

wavesurfer1.on("ready", () => {
  trackReady = true;
  bindMedia(getMedia());
  cacheDuration();
  updateProgressUi();
  if (playAfterLoad) {
    playAfterLoad = false;
    wavesurfer1.play().then(setPlayingButton).catch((err) => {
      console.error("Playback failed:", err);
      resetPlayButton();
    });
  }
});

wavesurfer1.on("timeupdate", updateProgressUi);
wavesurfer1.on("audioprocess", updateProgressUi);
wavesurfer1.on("seeking", updateProgressUi);
wavesurfer1.on("play", setPlayingButton);
wavesurfer1.on("pause", resetPlayButton);

wavesurfer1.on("error", (err) => {
  trackReady = false;
  playAfterLoad = false;
  console.error("WaveSurfer error:", err);
});

if (progressEl) {
  progressEl.addEventListener("pointerdown", () => {
    isSeeking = true;
  });
  progressEl.addEventListener("input", () => {
    isSeeking = true;
    const { duration } = getTimes();
    const ratio = Number(progressEl.value) / 1000;
    progressEl.style.setProperty("--progress", `${ratio * 100}%`);
    if (timeEl && Number.isFinite(duration) && duration > 0) {
      timeEl.textContent = formatTime(ratio * duration);
    }
  });
  const commitSeek = () => {
    const { duration } = getTimes();
    if (Number.isFinite(duration) && duration > 0) {
      const time = (Number(progressEl.value) / 1000) * duration;
      if (typeof wavesurfer1.setTime === "function") {
        wavesurfer1.setTime(time);
      } else {
        wavesurfer1.seekTo(Number(progressEl.value) / 1000);
      }
    }
    isSeeking = false;
    updateProgressUi();
  };
  progressEl.addEventListener("change", commitSeek);
  progressEl.addEventListener("pointerup", commitSeek);
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

document.getElementById("nextTrack").addEventListener("click", () => {
  playAfterLoad = false;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  resetPlayButton();
  loadTrack(currentTrackIndex);
});

document.getElementById("prevTrack").addEventListener("click", () => {
  playAfterLoad = false;
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
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
