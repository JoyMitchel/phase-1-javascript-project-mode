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


    addSongForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newSong = {
            title: document.getElementById("new-song-title").value,
            artist: document.getElementById("new-song-artist").value,
            image: document.getElementById("new-song-image").value,
            audio: document.getElementById("new-song-audio").value
        };

        fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSong)
        })
            .then(response => response.json())
            .then(() => fetchSongs())
            .catch(err => console.error("Error adding song: ", err));
    });

    function playSong(e) {
        const songId = e.target.dataset.id;
        fetch(`${baseUrl}/${songId}`)
            .then(response => response.json())
            .then(song => {
                audioPlayer.src = song.audio;
                audioPlayer.play();
                songTitle.textContent = song.title;
                songArtist.textContent = song.artist;
                playerImage.src = song.image;
            })
            .catch(err => console.error("Error playing song: ", err));
    }