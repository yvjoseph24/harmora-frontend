const supabase = window.supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

// AUTH SAFE CHECK
async function getUserSafe(){
  const { data:{ user } } = await supabase.auth.getUser();
  if(!user) throw new Error("Not logged in");
  return user;
}

// ARTIST
async function createArtist(){
  const user = await getUserSafe();

  await supabase.from("artists").insert({
    user_id:user.id,
    artist_name:artistName.value,
    bio:artistBio.value
  });

  loadArtists();
}

// UPLOAD
async function uploadSong(){
  const user = await getUserSafe();

  const fileName = Date.now()+songFile.files[0].name;

  await supabase.storage.from("music").upload(fileName, songFile.files[0]);

  const { data } = supabase.storage.from("music").getPublicUrl(fileName);

  await supabase.from("songs").insert({
    artist_id:user.id,
    title:songTitle.value,
    price:Number(songPrice.value),
    audio_url:data.publicUrl
  });

  loadSongs();
}

// LOAD SONGS
async function loadSongs(){
  const { data } = await supabase.from("songs").select("*");

  songs.innerHTML = data.map(s => `
    <div class="card">
      <h3>${s.title}</h3>
      <p>$${s.price}</p>
      <button onclick="play('${s.audio_url}','${s.title}')">Play</button>
      <button onclick="buy('${s.title}',${s.price},'${s.id}')">Buy</button>
    </div>
  `).join("");
}

// LOAD ARTISTS
async function loadArtists(){
  const { data } = await supabase.from("artists").select("*");

  artists.innerHTML = data.map(a => `
    <div class="card">
      <h3>${a.artist_name}</h3>
      <p>${a.bio}</p>
    </div>
  `).join("");
}

// PLAYER
function play(url,name){
  audio.src=url;
  audio.play();
  trackName.innerText=name;
}

function toggle(){
  audio.paused ? audio.play() : audio.pause();
}

// STRIPE CALL (BACKEND ONLY TRUSTED)
async function buy(name,price,id){
  const res = await fetch("https://YOUR-BACKEND.onrender.com/pay",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ songId:id })
  });

  const data = await res.json();
  window.location.href = data.url;
}

// INIT
loadSongs();
loadArtists();
