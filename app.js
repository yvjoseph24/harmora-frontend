console.log("APP LOADED");

// =====================
// SUPABASE INIT (ONLY ONCE)
// =====================
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// =====================
// AUTH
// =====================
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
    password
  });

  if (error) return alert(error.message);
  alert("Logged in");
}

// =====================
// UPLOAD SONG
// =====================
async function uploadSong() {
  console.log("UPLOAD CLICKED");

  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  if (!file) return alert("No file selected");

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return alert("You must be logged in");
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase
    .storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) {
    console.log(uploadError);
    return alert(uploadError.message);
  }

  const { data: urlData } = supabase
    .storage
    .from("music")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from("songs")
    .insert({
      title,
      price,
      audio_url: urlData.publicUrl,
      artist_id: userData.user.id
    });

  if (dbError) {
    console.log(dbError);
    return alert(dbError.message);
  }

  alert("UPLOAD SUCCESS");
  loadSongs();
}

// =====================
// LOAD SONGS
// =====================
async function loadSongs() {
  const feed = document.getElementById("songFeed");

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    feed.innerHTML = "Error loading songs";
    return;
  }

  feed.innerHTML = data.map(song => `
    <div class="card">
      <h3>${song.title}</h3>
      <p>$${song.price}</p>
      <audio controls src="${song.audio_url}"></audio>
    </div>
  `).join("");
}

// =====================
// BUTTON CONNECTIONS (NO onclick BUGS)
// =====================
document.getElementById("signupBtn").onclick = signup;
document.getElementById("loginBtn").onclick = login;
document.getElementById("uploadBtn").onclick = uploadSong;

// INIT
loadSongs();
