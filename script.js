// =========================================
// AUDIO SYSTEM
// =========================================
const audio = new Audio();

window.onload = function () {

  const playBtn = document.getElementById("playBtn");
  const songPopup = document.getElementById("songPopup");
  const songList = document.getElementById("songList");

  // =============================
  // SONG CONFIG
  // =============================
  const songs = [
    {
      file: "songs/song.mp3",
      thumb: "thumbs/thumb.png",
      title: "DJ AKU CALON MANTU TERBAIK MAMAMU FULLBASS",
      artist: ""
    },
    {
      file: "songs/song2.mp3",
      thumb: "thumbs/thumb2.png",
      title: "DJ CALON MANTU IDAMAN SLOW VIRAL TIKTOK FULL SONG",
      artist: ""
    },
    {
      file: "songs/song3.mp3",
      thumb: "thumbs/thumb3.png",
      title: "DJ TABOLA BALE X CALON MANTU IDAMAN SLOW VIRAL TIKTOK",
      artist: ""
    },
    {
      file: "songs/song4.mp3",
      thumb: "thumbs/thumb4.png",
      title: "DJ CALON MANTU TERBAIK MAMAMU X TABOLA BALE PLAT KT VIRAL",
      artist: ""
    },
    {
      file: "songs/song5.mp3",
      thumb: "thumbs/thumb5.png",
      title: "Mood - Lofi",
      artist: ""
    },
  {
    file: "songs/song6.mp3",
    thumb: "thumbs/thumb6.png",
    title: "Tu hai Kahan",
    artist: ""
  }
  ];


  // =============================
  // POPUP SONG LOADER
  // =============================
  function loadSongs() {
    const songList = document.getElementById("songList");
    const songPopup = document.getElementById("songPopup");
    songList.innerHTML = "";

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "song-item";

      div.innerHTML = `
        <img class="song-thumb" src="${song.thumb}">
        <div class="song-meta">
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      `;

      div.onclick = () => {
        audio.src = song.file;
        audio.play();

        playBtn.innerHTML = `
          <div class="audio-bars">
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        `;

        songPopup.style.display = "none";
        document.getElementById("songOverlay").style.display = "none";
      };

      songList.appendChild(div);
    });

    songPopup.style.display = "block";
    songOverlay.style.display = "block";

    setTimeout(() => {
      songPopup.classList.add("popup-show");
      songOverlay.style.opacity = "1";
    }, 10);
  }


  // =============================
  // CLICK EVENTS
  // =============================
  window.addEventListener("click", e => {
    const popup = document.getElementById("songPopup");
    const overlay = document.getElementById("songOverlay");

    if (e.target === overlay) {

      popup.classList.remove("popup-show");
      overlay.style.opacity = "0";

      setTimeout(() => {
        popup.style.display = "none";
        overlay.style.display = "none";
      }, 350);
    }
  });

  playBtn.addEventListener("click", () => {

  // If song is playing → stop
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    playBtn.innerHTML = "▶️ Play";
    return;
  }

  // Reset src
  if (audio.src) audio.src = "";

  loadSongs();

  // Show popup & overlay
  songPopup.style.display = "block";
  songOverlay.style.display = "block";

  // RESET ANIMATION → IMPORTANT
  songPopup.classList.remove("popup-show");
  songOverlay.style.opacity = "0";
  void songPopup.offsetWidth;  // force reflow (animation reset)

  // Start fade-in animation
  setTimeout(() => {
    songPopup.classList.add("popup-show");
    songOverlay.style.opacity = "1";
  }, 10);
});

  audio.addEventListener("ended", () => {
    playBtn.innerHTML = "▶️ Play";
  });

};


// =========================================
// FULL SCREEN TRIGGER
// =========================================
document.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen error:", err);
    });
  }
});


// =========================================
// HEART NAME TEXT TOGGLE
// =========================================
const heartName = document.getElementById('heartName');
let toggled = false;

heartName.addEventListener('click', () => {
  if (!toggled) {
    heartName.textContent = heartName.textContent.replace('𝚂𝙰𝙱𝙰𝙽𝙰', '𝚈𝙾𝚄');
  } else {
    heartName.textContent = heartName.textContent.replace('𝚈𝙾𝚄', '𝚂𝙰𝙱𝙰𝙽𝙰');
  }
  toggled = !toggled;
});



// =========================================
// MAIN TIMER + FIREBASE SYNC + HEARTS
// =========================================
(function () {

  const dtInput = document.getElementById('dt');
  const saveBtn = document.getElementById('saveBtn');
  const playBtn = document.getElementById('playBtn');
  const display = document.getElementById('display');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const heartsContainer = document.getElementById('hearts');

  const firebaseURL = "https://time-untill-see-you-default-rtdb.firebaseio.com/sabanaTime.json";

// 🔥 Helper functions  
function isOnline() {  
  return navigator.onLine;  
}  

// ===============================
// NEW FETCH FUNCTION
// ===============================
async function fetchFromFirebase() {  
  try {  
    const res = await fetch(firebaseURL);  
    if (!res.ok) throw new Error("Firebase fetch failed");  
    return await res.json();  
  } catch (err) {  
    console.warn("⚠️ Firebase fetch failed:", err);  
    return null;  
  }  
}  

// ===============================
// NEW SAVE FUNCTION
// ===============================
async function saveToFirebase(timeObj) {  
  try {  
    await fetch(firebaseURL, {  
      method: "PUT",  
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify(timeObj)  
    });  
    console.log("🔥 Saved to Firebase:", timeObj);  
  } catch (err) {  
    console.warn("⚠️ Firebase save failed:", err);  
    localStorage.setItem("pendingSync", JSON.stringify(timeObj));  
  }  
}  

// Pending sync if offline earlier  
async function syncIfPending() {  
  const pending = localStorage.getItem("pendingSync");  
  if (pending && isOnline()) {  
    await saveToFirebase(JSON.parse(pending));  
    localStorage.removeItem("pendingSync");  
    console.log("🔁 Synced pending local data to Firebase");  
  }  
}  

// SONG POPUP  
playBtn.addEventListener("click", () => {  
  loadSongs();  
  document.getElementById("songPopup").style.display = "block";  
});  

// ==========================================
// NEW — SMART SYNC SYSTEM (FULL REPLACEMENT)
// ==========================================

function isNewer(a, b) {
  return new Date(a.savedAt) > new Date(b.savedAt);
}

async function initSync() {  

  let local = localStorage.getItem("sabanaTimeObj");
  if (local) local = JSON.parse(local);

  let firebase = await fetchFromFirebase();

  // If nothing exists anywhere
  if (!local && !firebase) {
    console.log("No time found.");
    return update();
  }

  // CASE A — Only Firebase exists → load to local
  if (!local && firebase) {
    localStorage.setItem("sabanaTimeObj", JSON.stringify(firebase));
    dtInput.value = firebase.time;
    console.log("⬇️ Firebase → Local");
    return update();
  }

  // CASE B — Only Local exists → push to Firebase
  if (local && !firebase) {
    console.log("⬆️ Local → Firebase");
    saveToFirebase(local);
    dtInput.value = local.time;
    return update();
  }

  // CASE C — Both exist → compare timestamps
  if (isNewer(local, firebase)) {
    console.log("⬆️ Local is newer → Firebase updated");
    saveToFirebase(local);
    dtInput.value = local.time;
  } else {
    console.log("⬇️ Firebase is newer → Local updated");
    localStorage.setItem("sabanaTimeObj", JSON.stringify(firebase));
    dtInput.value = firebase.time;
  }

  update();
}

  window.addEventListener("online", syncIfPending);

  const photos = [
    "love.jpg","love2.jpg","love3.jpg","love4.jpg","love5.jpg","love6.jpg",
    "love7.jpg","love8.jpg","love9.jpg","love10.jpg","love11.jpg","love12.jpg",
    "love13.jpg","love14.jpg","love15.jpg","love16.jpg"
  ];

  const heartPath =
    "M50 91 C35 78, 5 56, 5 33 C5 20, 17 10, 30 12 C38 13.5, 45 19, 50 27 " +
    "C55 19, 62 13.5, 70 12 C83 10, 95 20, 95 33 C95 56, 65 78, 50 91 Z";


  function addOneHeart(src) {
    const svgNS = "http://www.w3.org/2000/svg";
    const i = Date.now() % 10000;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.classList.add("photo-heart");

    svg.style.left = Math.round(Math.random() * 80) + "%";
    svg.style.setProperty("--tilt", (Math.random() * 40 - 20) + "deg");

    const dur = 15 + Math.round(Math.random() * 6);
    svg.style.animationName = "rise";
    svg.style.animationDuration = dur + "s";

    const clipId = "clipHeart" + i + "-" + Math.floor(Math.random() * 10000);

    const defs = document.createElementNS(svgNS, "defs");
    const clipPath = document.createElementNS(svgNS, "clipPath");
    clipPath.setAttribute("id", clipId);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", heartPath);

    clipPath.appendChild(path);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    const img = document.createElementNS(svgNS, "image");
    img.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);
    img.setAttribute("width", "100%");
    img.setAttribute("height", "100%");
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    img.setAttribute("clip-path", `url(#${clipId})`);
    svg.appendChild(img);

    const outline = document.createElementNS(svgNS, "path");
    outline.setAttribute("d", heartPath);
    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "rgba(255,107,158,0.95)");
    outline.setAttribute("stroke-width", "2.5");
    svg.appendChild(outline);

    heartsContainer.appendChild(svg);

    setTimeout(() => svg.remove(), dur * 1000);
  }


  setInterval(() => {
    const idx = Math.floor(Math.random() * photos.length);
    addOneHeart(photos[idx]);
  }, 5000);

  addOneHeart(photos[0]);


  function pad2(n) {
    return n.toString().padStart(2, '0');
  }

  function getTargetValue() {
    return dtInput.value || localStorage.getItem("sabanaTime") || "";
  }

  function update() {
    const val = getTargetValue();

    if (!val) {
      display.textContent = "--:--:--:--";
      daysEl.textContent = hoursEl.textContent =
        minutesEl.textContent = secondsEl.textContent = "--";
      return;
    }

    const target = new Date(val);
    const now = new Date();
    let diffMs = now - target;

    const negative = diffMs < 0;
    diffMs = Math.abs(diffMs);

    const totalSeconds = Math.floor(diffMs / 1000);
    const seconds = totalSeconds % 60;

    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;

    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;

    const days = Math.floor(totalHours / 24);

    const sign = negative ? "-" : "";

    display.textContent =
      sign + pad2(days) + ":" + pad2(hours) + ":" +
      pad2(minutes) + ":" + pad2(seconds);

    daysEl.textContent = days;
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(seconds);
  }


  const saved = localStorage.getItem("sabanaTime");
  if (saved) dtInput.value = saved;

  dtInput.addEventListener("input", () => {
    if (dtInput.value) {
      localStorage.setItem("sabanaTime", dtInput.value);
    }
    update();
  });

  saveBtn.addEventListener("click", () => {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');

    const localStr =
      now.getFullYear() + "-" +
      pad(now.getMonth() + 1) + "-" +
      pad(now.getDate()) + "T" +
      pad(now.getHours()) + ":" +
      pad(now.getMinutes()) + ":" +
      pad(now.getSeconds());

    dtInput.value = localStr;
    localStorage.setItem("sabanaTime", localStr);

    saveBtn.textContent = "Reset Done 🥰";

    update();

    setTimeout(() => {
      saveBtn.textContent = "I Meet Her Again 🥰";
    }, 1400);

    if (isOnline()) {
      saveToFirebase(localStr);
    } else {
      localStorage.setItem("pendingSync", localStr);
    }
  });


  initSync();
  setInterval(update, 1000);

})();