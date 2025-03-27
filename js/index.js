document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "https://phase-1-javascript-project-mode-green.vercel.app/";
    const songListUl = document.getElementById("song-list");
    const addSongForm = document.getElementById("add-song-form");

    function fetchSongs() {
        fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                songListUl.innerHTML = ''; 
                data.forEach(song => {
                    const songItem = document.createElement("li");

                    const songTitle = document.createElement("h4");
                    songTitle.textContent = `${song.title} - ${song.artist}`;
                    songItem.appendChild(songTitle);

                    const songImage = document.createElement("img");
                    songImage.src = `assets/images/${song.image}`;
                    songImage.alt = song.title;
                    songItem.appendChild(songImage);

                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-btn");
                    deleteButton.textContent = "Delete";
                    deleteButton.dataset.id = song.id;
                    songItem.appendChild(deleteButton);

                    songListUl.appendChild(songItem);
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', deleteSong);
                });
            })
            .catch(err => console.error("Error fetching songs: ", err));
    }

    addSongForm.addEventListener("submit", (sub) => {
        sub.preventDefault();
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

    function deleteSong(sub) {
        const songId = sub.target.dataset.id;
        fetch(`${baseUrl}/${songId}`, {
            method: "DELETE"
        })
        .then(() => fetchSongs())
        .catch(err => console.error("Error deleting song: ", err));
    }

    document.addEventListener("DOMContentLoaded" , fetchSongs)
});



