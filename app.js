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

  const file = document.getElementById("songFile").files[0];

  if (!file) {
    alert("No file selected");
    return;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    alert("NOT LOGGED IN");
    return;
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

  alert("UPLOAD SUCCESS");
}
