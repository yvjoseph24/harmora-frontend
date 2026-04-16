const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// 🔐 SIGN UP
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  alert("Account created");
}


// 🔐 LOGIN
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


// 🎤 UPLOAD SONG
async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  const user = await supabase.auth.getUser();

  const fileName = `${Date.now()}-${file.name}`;

  // upload file
  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) return alert(uploadError.message);

  // get url
  const { data } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  // save to DB
  const { error: dbError } = await supabase
    .from("songs")
    .insert({
      title,
      price,
      audio_url: data.publicUrl,
      artist_id: user.data.user.id
    });

  if (dbError) return alert(dbError.message);

  alert("Song uploaded!");

  loadSongs();
}


// 🎧 LOAD SONGS
async function loadSongs() {
  const { data } = await supabase.from("songs").select("*");

  const feed = document.getElementById("songFeed");
  feed.innerHTML = "";

  data.forEach(song => {
    feed.innerHTML += `
      <div class="card">
        <h3>${song.title}</h3>
        <p>$${song.price}</p>

        <button onclick="playSong('${song.audio_url}', '${song.title}')">
          Play
        </button>
      </div>
    `;
  });
}


// ▶️ PLAY
function playSong(url, title) {
  document.getElementById("audio").src = url;
  document.getElementById("trackName").innerText = title;
  document.getElementById("audio").play();
}


// INIT
loadSongs();
