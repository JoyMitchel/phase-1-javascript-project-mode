document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/songs";
    const songListUl = document.getElementById("songs-list-ul");
    const audioPlayer = document.getElementById("audio-player");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const playerImage = document.getElementById("player-image");
    const addSongForm = document.getElementById("add-song");

    function fetchSongs() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                songListUl.innerHTML = '';
                data.forEach(song => {
                    const songItem = document.createElement("li");
                    songItem.innerHTML = `
                        <h4>${song.title} - ${song.artist}</h4>
                        <button class="play-btn" data-id="${song.id}">Play</button>
                        <button class="delete-btn" data-id="${song.id}">Delete</button>
                    `;
                    songListUl.appendChild(songItem);
                });

                document.querySelectorAll('.play-btn').forEach(button => {
                    button.addEventListener('click', playSong);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', deleteSong);
                });
            })
            .catch(err => console.error("Error fetching songs: ", err));
    }