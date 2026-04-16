console.log("APP LOADED");

// ---------------------------
// 🔐 SUPABASE INIT (ONLY ONCE)
// ---------------------------
if (!window.supabase) {
  console.error("Supabase not loaded. Check script order in HTML.");
}

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ---------------------------
// 🔐 AUTH
// ---------------------------
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  alert("Account created");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return alert(error.message);

  alert("Logged in");
}

// ---------------------------
// 🎤 UPLOAD SONG
// ---------------------------
async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  if (!file) {
    alert("No file selected");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    alert("You must be logged in");
    return;
  }

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) {
    console.error(uploadError);
    alert(uploadError.message);
    return;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  // Save to database
  const { error: dbError } = await supabase.from("songs").insert({
    title,
    price,
    audio_url: urlData.publicUrl,
    artist_id: userData.user.id,
  });

  if (dbError) {
    console.error(dbError);
    alert(dbError.message);
    return;
  }

  alert("Upload successful");

  loadSongs();
}

// ---------------------------
// 🎧 LOAD SONG FEED
// ---------------------------
async function loadSongs() {
  const container = document.getElementById("songFeed");

  if (!container) return;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading songs</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No songs yet</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (song) => `
    <div class="card">
      <h4>${song.title}</h4>
      <p>$${song.price}</p>
      <button onclick="playSong('${song.audio_url}', '${song.title}')">
        ▶ Play
      </button>
    </div>
  `
    )
    .join("");
}

// ---------------------------
// ▶️ PLAYER
// ---------------------------
function playSong(url, title) {
  const audio = document.getElementById("audio");
  const name = document.getElementById("trackName");

  if (!audio) return;

  audio.src = url;
  audio.play();

  if (name) name.innerText = title;
}

// ---------------------------
// 🚀 INIT
// ---------------------------
loadSongs();
