document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/songs";
    const songListUl = document.getElementById("song-list");
    const addSongForm = document.getElementById("add-song-form");

    function fetchSongs() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                songListUl.innerHTML = '';
                data.forEach(song => {
                    const songItem = document.createElement("li");
                    songItem.innerHTML = `
                        <h4>${song.title} - ${song.artist}</h4>
                        <img src="assets/images/${song.image}" alt="${song.title}">
                        <button class="delete-btn" data-id="${song.id}">Delete</button>
                    `;
                    songListUl.appendChild(songItem);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', deleteSong);
                });
            })
            .catch(err => console.error("Error fetching songs: ", err));
    }

    addSongForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const imageFile = document.getElementById("new-song-image").files[0];

        if (!imageFile) {
            alert("Please select an image file.");
            return;
        }

        const newSong = {
            title: document.getElementById("new-song-title").value,
            artist: document.getElementById("new-song-artist").value,
            image: imageFile.name,
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


