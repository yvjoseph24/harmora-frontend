console.log("APP LOADED");

// =====================
// SUPABASE INIT
// =====================
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// =====================
// AUTH
// =====================
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);
  alert("Account created");
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);
  alert("Logged in");
});

// =====================
// UPLOAD
// =====================
document.getElementById("uploadBtn").addEventListener("click", async () => {
  console.log("UPLOAD CLICKED");

  const title = document.getElementById("songTitle").value;
  const price = document.getElementById("songPrice").value;
  const file = document.getElementById("songFile").files[0];

  if (!file) return alert("No file selected");

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return alert("NOT LOGGED IN");
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
});
