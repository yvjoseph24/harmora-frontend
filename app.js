const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ---------------- LOGIN ----------------
async function signup() {
  const email = emailEl().value;
  const password = passEl().value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  alert("Account created 🎧");
}

async function login() {
  const email = emailEl().value;
  const password = passEl().value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  alert("Logged in 🎧");
}

function emailEl(){ return document.getElementById("email"); }
function passEl(){ return document.getElementById("password"); }

// ---------------- ARTIST ----------------
async function createArtist() {
  const name = document.getElementById("artistName").value;
  const bio = document.getElementById("artistBio").value;

  const user = await supabase.auth.getUser();

  const { error } = await supabase.from("artists").insert({
    user_id: user.data.user.id,
    artist_name: name,
    bio: bio
  });

  if (error) return alert(error.message);

  alert("Artist created 🎤");
  loadArtists();
}

// ---------------- UPLOAD MUSIC ----------------
async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  const user = await supabase.auth.getUser();

  const fileName = Date.now() + "-" + file.name;

  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) return alert(uploadError.message);

  const { data } = supabase.storage.from("music").getPublicUrl(fileName);

  const { error } = await supabase.from("songs").insert({
    artist_id: user.data.user.id,
    title,
    price,
    audio_url: data.publicUrl
  });

  if (error) return alert(error.message);

  alert("Uploaded 🎧");
  loadSongs();
}

// ---------------- LOAD SONGS ----------------
async function loadSongs() {
  const { data } = await supabase.from("songs").select("*");

  const container = document.getElementById("songs");
  container.innerHTML = "";

  data.forEach(song => {
    container.innerHTML += `
      <div class="card">
        <h3>${song.title}</h3>
        <p>$${song.price}</p>
        <button onclick="playSong('${song.audio_url}','${song.title}')">▶ Play</button>
        <button onclick="buy('${song.title}', ${song.price})">Buy</button>
      </div>
    `;
  });
}

// ---------------- LOAD ARTISTS ----------------
async function loadArtists() {
  const { data } = await supabase.from("artists").select("*");

  const container = document.getElementById("artistList");
  container.innerHTML = "";

  data.forEach(a => {
    container.innerHTML += `
      <div class="card">
        <h3>${a.artist_name}</h3>
        <p>${a.bio}</p>
      </div>
    `;
  });
}

// ---------------- STRIPE ----------------
async function buy(name, price) {
  const res = await fetch("https://YOUR-RENDER.onrender.com/create-checkout-session", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ product: { name, price } })
  });

  const data = await res.json();
  window.location.href = data.url;
}

// ---------------- PLAYER ----------------
function playSong(url, name) {
  const audio = document.getElementById("audio");
  document.getElementById("trackName").innerText = name;
  audio.src = url;
  audio.play();
}

function togglePlay() {
  const audio = document.getElementById("audio");
  if (audio.paused) audio.play();
  else audio.pause();
}

// ---------------- INIT ----------------
loadSongs();
loadArtists();
