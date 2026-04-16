// 🔐 Supabase Setup
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 📌 Navigation
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
}

// 🔐 Authentication
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  alert("Account created! Please check your email.");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  alert("Logged in successfully!");
}

async function logout() {
  await supabase.auth.signOut();
  alert("Logged out.");
}

// 🎧 Upload Song
async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  if (!file) return alert("Please select a file.");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return alert("Please log in first.");

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) return alert(uploadError.message);

  const { data } = supabase.storage.from("music").getPublicUrl(fileName);

  const { error } = await supabase.from("songs").insert({
    artist_id: userData.user.id,
    title,
    price,
    audio_url: data.publicUrl
  });

  if (error) return alert(error.message);

  alert("Song uploaded!");
  loadSongs();
}

// 🎵 Load Songs
async function loadSongs() {
  const { data, error } = await supabase.from("songs").select("*");
  const feed = document.getElementById("songFeed");

  if (error) {
    feed.innerHTML = "<p>Error loading songs.</p>";
    return;
  }

  if (!data || data.length === 0) {
    feed.innerHTML = "<p>No songs yet.</p>";
    return;
  }

  feed.innerHTML = data.map(song => `
    <div class="card">
      <h3>${song.title}</h3>
      <p>$${song.price}</p>
      <button onclick="playSong('${song.audio_url}', '${song.title}')">▶ Play</button>
    </div>
  `).join("");
}

// 🎤 Load Artists
async function loadArtists() {
  const { data, error } = await supabase.from("artists").select("*");
  const list = document.getElementById("artistList");

  if (error) {
    list.innerHTML = "<p>Error loading artists.</p>";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No artists yet.</p>";
    return;
  }

  list.innerHTML = data.map(a => `
    <div class="card">
      <h3>${a.artist_name}</h3>
      <p>${a.bio || ""}</p>
    </div>
  `).join("");
}

// 🎧 Music Player
function playSong(url, name) {
  const audio = document.getElementById("audio");
  document.getElementById("trackName").textContent = name;
  audio.src = url;
  audio.play();
}

function togglePlay() {
  const audio = document.getElementById("audio");
  audio.paused ? audio.play() : audio.pause();
}

// 🚀 Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSongs();
  loadArtists();
});

feed.innerHTML = data.map(song => `
  <div class="card">
    <img src="https://via.placeholder.com/300x300?text=Harmora"
         alt="Artwork" class="artwork">
    <h3>${song.title}</h3>
    <p>$${song.price}</p>
    <div class="card-actions">
      <button class="btn-primary"
        onclick="playSong('${song.audio_url}', '${song.title}')">▶ Play</button>
      <button class="btn-secondary"
        onclick="buySong('${song.title}', ${song.price})">Buy</button>
    </div>
  </div>
`).join("");

const audio = document.getElementById("audio");
const progressBar = document.getElementById("progressBar");

audio.addEventListener("timeupdate", () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});
