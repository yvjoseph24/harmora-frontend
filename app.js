async function buy(name, price) {
  const res = await fetch("https://YOUR-RENDER-URL.onrender.com/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product: { name, price } }),
  });

  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

// PLAYER SYSTEM
let isPlaying = false;

function playTrack(name, file) {
  const audio = document.getElementById("audioPlayer");
  const trackName = document.getElementById("trackName");

  trackName.innerText = name;
  audio.src = file;
  audio.play();
  isPlaying = true;
}

function togglePlay() {
  const audio = document.getElementById("audioPlayer");

  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
}
