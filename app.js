console.log("APP LOADED");

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// AUTH CHECK
async function checkUser() {
  const { data, error } = await supabase.auth.getUser();
  console.log("USER CHECK:", data, error);
  return data.user;
}

// UPLOAD TEST
async function uploadSong() {
  console.log("UPLOAD CLICKED");

  const file = document.getElementById("songFile").files[0];

  if (!file) {
    alert("No file selected");
    return;
  }

  const user = await checkUser();

  if (!user) {
    alert("NOT LOGGED IN");
    return;
  }

  console.log("USER OK:", user.id);
  console.log("STARTING STORAGE UPLOAD...");

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase
    .storage
    .from("music")
    .upload(fileName, file);

  console.log("UPLOAD DATA:", data);
  console.log("UPLOAD ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("UPLOAD WORKED");
}
