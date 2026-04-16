<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Harmora</title>

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="styles.css">

  <!-- Supabase CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>

<div class="layout">
  <!-- Sidebar -->
  <aside class="sidebar">
    <h2 class="logo">🎧 Harmora</h2>
    <nav>
      <button onclick="loadSongs()">Explore</button>
      <button onclick="loadArtists()">Artists</button>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="main">
    <section class="hero">
      <h1>Discover New Music</h1>
      <p>Empowering artists and connecting fans.</p>
    </section>

    <h2 class="section-title">Trending Tracks</h2>
    <div id="songs" class="grid"></div>

    <h2 class="section-title">Featured Artists</h2>
    <div id="artists" class="grid"></div>
  </main>
</div>

<!-- Player -->
<div id="player">
  <span id="trackName">No track playing</span>
  <div class="player-controls">
    <button onclick="togglePlay()">Play/Pause</button>
  </div>
  <audio id="audio"></audio>
</div>

<!-- JavaScript Files -->
<script src="js/supabase.js"></script>
<script src="js/player.js"></script>
<script src="js/songs.js"></script>
<script src="js/artists.js"></script>
<script src="js/app.js"></script>

</body>
</html>
