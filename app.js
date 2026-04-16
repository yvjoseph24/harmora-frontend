console.log("APP LOADED");

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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

async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  const fileName = Date.now() + file.name;

  await supabase.storage.from("music").upload(fileName, file);

  const { data } = supabase.storage.from("music").getPublicUrl(fileName);

  await supabase.from("songs").insert({
    title,
    price,
    audio_url: data.publicUrl
  });

  alert("Uploaded!");
}
