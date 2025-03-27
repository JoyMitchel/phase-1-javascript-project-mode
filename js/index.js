document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/songs";
    const songListUl = document.getElementById("song-list");
    const audioPlayer = document.getElementById("audio-player");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const playerImage = document.getElementById("image");
    const addSongForm = document.getElementById("add-song-form");

    function fetchSongs() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                songListUl.innerHTML = '';
                data.forEach(song => {
                    if (isValidSongFile(song.image, song.audio)) {
                        const songItem = document.createElement("li");
                        songItem.innerHTML = `
                            <h4>${song.title} - ${song.artist}</h4>
                            <button class="play-btn" data-id="${song.id}">Play</button>
                            <button class="delete-btn" data-id="${song.id}">Delete</button>
                        `;
                        songListUl.appendChild(songItem);
                    }
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

    function isValidSongFile(imagePath, audioPath) {
        const imageFile = `assets/images/${imagePath}`;
        const audioFile = `assets/audios/${audioPath}`;
        return imagePath && audioPath && fileExists(imageFile) && fileExists(audioFile);
    }

    function fileExists(filePath) {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', filePath, false);
        try {
            xhr.send();
            return xhr.status === 200;
        } catch (e) {
            return false;
        }
    }

    addSongForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const imageFile = document.getElementById("new-song-image").files[0];
        const audioFile = document.getElementById("new-song-audio").files[0];

        if (!imageFile || !audioFile) {
            alert("Please select both an image and an audio file.");
            return;
        }

        const newSong = {
            title: document.getElementById("new-song-title").value,
            artist: document.getElementById("new-song-artist").value,
            image: imageFile.name,
            audio: audioFile.name
        };

        if (!isValidSongFile(newSong.image, newSong.audio)) {
            alert("The selected image or audio file does not exist in the assets folder.");
            return;
        }

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
                audioPlayer.src = `assets/audios/${song.audio}`;
                audioPlayer.play();
                songTitle.textContent = song.title;
                songArtist.textContent = song.artist;
                playerImage.src = `assets/images/${song.image}`;
            })
            .catch(err => console.error("Error playing song: ", err));
    }

    function deleteSong(e) {
        const songId = e.target.dataset.id;
        fetch(`${baseUrl}/${songId}`, {
            method: "DELETE"
        })
        .then(() => fetchSongs())
        .catch(err => console.error("Error deleting song: ", err));
    }

    fetchSongs();
});
