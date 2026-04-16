console.log("APP LOADED");

const supabase = window.supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

document.getElementById("uploadBtn").addEventListener("click", async () => {
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

  const { error } = await supabase
    .storage
    .from("music")
    .upload(Date.now() + "-" + file.name, file);

  if (error) {
    alert(error.message);
    return;
  }

  alert("UPLOAD WORKED");
});
