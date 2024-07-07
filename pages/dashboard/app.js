
document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById("audio-player");
    const playButton = document.querySelector(".footer__button--play");
    const playIcon = document.getElementById("play-icon");
    const progressBar = document.getElementById("progress-bar");
    const currentTimeElement = document.getElementById("current-time");
    const durationElement = document.getElementById("duration");
    const volumeSlider = document.getElementById("volume-slider");
    const episodeTitleElement = document.getElementById("episode-title");
    const podcastHostElement = document.getElementById("podcast-host");
    const episodeCoverElement = document.getElementById("episode-cover");

    const podcastListElement = document.getElementById("podcast-list");
    const episodeListElement = document.getElementById("episode-list");

   

    let tracks = [];
    let currentTrackIndex = 0;

    async function fetchAllPodcasts() {
        try {
            const response = await fetch("https://ecos-podcast.onrender.com/api/podcasts/");
            const podcasts = await response.json();
            console.log("Podcasts loaded:", podcasts);
            renderPodcasts(podcasts);
        } catch (error) {
            console.error("Error fetching podcasts:", error);
        }
    }

    async function fetchAllEpisodes() {
        try {
            const response = await fetch("https://ecos-podcast.onrender.com/api/episodes/");
            tracks = await response.json();
            renderEpisodes(tracks);
            loadTrack(currentTrackIndex);
        } catch (error) {
            console.error("Error fetching episodes:", error);
        }
    }

    function renderPodcasts(podcasts) {
        podcastListElement.innerHTML = '';
        podcasts.forEach(podcast => {
            const podcastItem = document.createElement('div');
            podcastItem.className = 'podcast-item';
            podcastItem.innerHTML = `
        <figure class="podcast-cover">
            <img src="${podcast.img_secure_url}" alt="${podcast.title}">
        </figure>
        <h3 class="podcast-title">${podcast.title}</h3>
        <span class="podcast-host">${podcast.host}</span>
    `;
            podcastListElement.appendChild(podcastItem);
        });
    }

    function renderEpisodes(episodes) {
        episodeListElement.innerHTML = '';
        episodes.forEach((episode, index) => {
            const episodeItem = document.createElement('div');
            episodeItem.className = 'episode-item';
            episodeItem.innerHTML = `
        <figure class="episode-cover">
            <img src="${episode.img_secure_url}" alt="${episode.title}">
        </figure>
        <div class="episode-info">
            <h3 class="episode-title">${episode.title}</h3>
            <p class="episode-description">${episode.description}</p>
            <span class="episode-host">${episode.host}</span>
        </div>
        <button class="episode-play" onclick="playTrack(${index})"><i class="fas fa-play"></i></button>
    `;
            episodeListElement.appendChild(episodeItem);
        });
    }

    function loadTrack(index) {
        if (tracks.length === 0) return;

        const track = tracks[index];
        audioPlayer.src = track.audio_secure_url;
        audioPlayer.load();
        updateTrackInfo(track);
        updatePlayButton();
        updateDuration();
    }

    function updateTrackInfo(track) {
        episodeTitleElement.textContent = track.title;
        podcastHostElement.textContent = track.host;
        episodeCoverElement.src = track.img_secure_url;
    }

    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayButton();
    }

    function playTrack(index) {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        updatePlayButton();
    }

    function updatePlayButton() {
        playIcon.classList.toggle('fa-play', audioPlayer.paused);
        playIcon.classList.toggle('fa-pause', !audioPlayer.paused);
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
    }

    function updateProgressBar() {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    }

    function updateDuration() {
        durationElement.textContent = formatTime(audioPlayer.duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    function setVolume(value) {
        audioPlayer.volume = value / 100;
    }

    audioPlayer.addEventListener("timeupdate", updateProgressBar);
    audioPlayer.addEventListener("loadedmetadata", updateDuration);

    volumeSlider.addEventListener("input", (e) => setVolume(e.target.value));

    fetchAllPodcasts();
    fetchAllEpisodes();

    // Expose functions to global scope
    window.togglePlay = togglePlay;
    window.prevTrack = prevTrack;
    window.nextTrack = nextTrack;
    window.setVolume = setVolume;
    window.playTrack = playTrack;
});