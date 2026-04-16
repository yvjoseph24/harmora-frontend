console.log("APP LOADED");

// =====================
// 1. SUPABASE INIT
// =====================
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// =====================
// 2. AUTH
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
// 3. UPLOAD SONG
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

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) {
    console.log(uploadError);
    return alert(uploadError.message);
  }

  // Get URL
  const { data: urlData } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  // Insert DB
  const { error: dbError } = await supabase.from("songs").insert({
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
// 4. LOAD SONGS FEED
// =====================
async function loadSongs() {
  const container = document.getElementById("songFeed");

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    container.innerHTML = "<p>Error loading songs</p>";
    return;
  }

  container.innerHTML = data.map(song => `
    <div>
      <h4>${song.title}</h4>
      <p>$${song.price}</p>
      <audio controls src="${song.audio_url}"></audio>
    </div>
  `).join("");
}

// =====================
// 5. BUTTON CONNECTIONS
// =====================
document.getElementById("signupBtn").onclick = signup;
document.getElementById("loginBtn").onclick = login;
document.getElementById("uploadBtn").onclick = uploadSong;

// Load feed on start
loadSongs();
