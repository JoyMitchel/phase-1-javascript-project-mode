document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000/songs";

    const songListUl = document.getElementById("songs-list-ul");
    const audioPlayer = document.getElementById("audio-player");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const playerImage = document.getElementById("player-image");
    const addSongForm = document.getElementById("add-song");