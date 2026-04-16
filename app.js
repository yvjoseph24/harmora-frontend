console.log("APP LOADED");

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function uploadSong() {
  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  console.log("UPLOAD STARTED");
  console.log("FILE:", file);

  if (!file) {
    alert("No file selected");
    return;
  }

  const fileName = Date.now() + "-" + file.name;

  // CHECK USER LOGIN
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log("USER:", userData);
  console.log("USER ERROR:", userError);

  if (userError || !userData.user) {
    alert("You are NOT logged in");
    return;
  }

  // UPLOAD
  const { data, error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  console.log("UPLOAD RESPONSE:", data);
  console.log("UPLOAD ERROR:", uploadError);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  // PUBLIC URL
  const { data: urlData } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  console.log("URL:", urlData);

  // DB INSERT
  const { error: dbError } = await supabase.from("songs").insert({
    title,
    price,
    audio_url: urlData.publicUrl,
    artist_id: userData.user.id
  });

  console.log("DB ERROR:", dbError);

  if (dbError) {
    alert(dbError.message);
    return;
  }

  alert("UPLOAD SUCCESS");
}

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
