document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/songs";
    const songListUl = document.getElementById("song-list");
    const addSongForm = document.getElementById("song-form");

    function fetchSongs() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(songs => {
                songListUl.innerHTML = ''; 
                songs.forEach(song => {
                    const songItem = document.createElement("li");

                    const songTitle = document.createElement("h4");
                    songTitle.textContent = `${song.title} - ${song.artist}`;
                    songItem.appendChild(songTitle);

                    const songImage = document.createElement("img");
                    songImage.src = `assets/images/${song.image}`;
                    songImage.alt = song.title;
                    songItem.appendChild(songImage);

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.dataset.id = song.id;
                    deleteButton.classList.add("delete-btn");
                    songItem.appendChild(deleteButton);

                    songListUl.appendChild(songItem);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', deleteSong);
                });
            })
            .catch(err => console.error("Error fetching songs: ", err));
    }

    addSongForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newSong = {
            title: document.getElementById("song-title").value,
            artist: document.getElementById("song-artist").value,
            image: document.getElementById("song-image").files[0].name,
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

        addSongForm.reset();
    });

    function deleteSong(e) {
        const songId = e.target.dataset.id;
        fetch(`${baseUrl}/${songId}`, {
            method: "DELETE"
        })
        .then(() => fetchSongs())
        .catch(err => console.error("Error deleting song: ", err));
    }

    function updateSong(songId, updatedSongData) {
        fetch(`${baseUrl}/${songId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSongData)
        })
        .then(response => response.json())
        .then(() => fetchSongs())
        .catch(err => console.error("Error updating song: ", err));
    }

    function addUpdateButton(songItem, song) {
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add("update-btn");
        updateButton.dataset.id = song.id;

        updateButton.addEventListener("click", function () {
            const updatedSongData = {
                title: "Updated " + song.title,
                artist: song.artist,
                image: song.image
            };

            updateSong(song.id, updatedSongData);
        });

        songItem.appendChild(updateButton);
    }

    fetchSongs();
});




