document.addEventListener('DOMContentLoaded', async () => {
    const podcastContainer = document.getElementById('podcast-container');
    const audioPlayer = document.getElementById('audio-player');
    const episodeCover = document.getElementById('episode-cover');
    const episodeTitleElement = document.getElementById('episode-title');
    const podcastHost = document.getElementById('podcast-host');
    const playIcon = document.getElementById('play-icon');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const progressBar = document.getElementById('progress-bar');

    const formSpinner = document.querySelector('.form-spinner');

    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.getElementById('closeModal');
    const episodeForm = document.getElementById('episodeForm');
    const podcastForm = document.getElementById('podcastForm');
    const editPodcastForm = document.getElementById('editPodcastForm');
    const modalTitle = document.getElementById('modal-title');
    let currentPodcastId;

     const perfil = JSON.parse(sessionStorage.getItem("user"));
     const userId = perfil.id;

    // Open modal for episode or podcast
    function openModal(isPodcast = false, podcastId) {
        currentPodcastId = podcastId;
        if (isPodcast) {
            modalTitle.textContent = 'Subir Podcast';
            episodeForm.style.display = 'none';
            editPodcastForm.style.display = 'none';
            podcastForm.style.display = 'block';
            openModalEditPodcast(false, '', '', '');

        } else {
            modalTitle.textContent = 'Subir Episodio';
            episodeForm.style.display = 'block';
            podcastForm.style.display = 'none';
        }
        uploadModal.style.display = 'block';
    }

    // Close modal
    closeModal.onclick = function () {
        uploadModal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == uploadModal) {
            uploadModal.style.display = 'none';
        }
    };

    // Add event listener to the add-podcast button
    document.querySelector('.add-podcast').addEventListener('click', () => openModal(true));

    getAllCategories();

    // Form de episodio
    episodeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        Spinner();

        // const spanMessage = document.createElement('span');
        // spanMessage.innerText = 'Publicando...';
        document.querySelector('.btn-publish').innerText = 'Publicando...';

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const img = document.getElementById('img').files[0];
        const audio = document.getElementById('audio').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('img', img);
        formData.append('audio', audio);
        formData.append('podcastId', currentPodcastId);

        // console.log(currentPodcastId);

        fetch('https://ecos-podcast.onrender.com/api/episodes', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {

                if (data) {
                    console.log('Episodio agregado con exito');
                    episodeForm.reset();
                    uploadModal.style.display = 'none';
                    window.location.reload();
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Form de podcast
    podcastForm.addEventListener('submit', function (e) {
        e.preventDefault();
        Spinner();
        document.querySelector('.btn-publish').innerText = 'Publicando...';

        const titlePodcast = document.getElementById('title-podcast').value;
        const descriptionPodcast = document.getElementById('description-podcast').value;
        const imgPodcast = document.getElementById('img-podcast').files[0];

        const formDataPodcast = new FormData();
        formDataPodcast.append('title', titlePodcast);
        formDataPodcast.append('description', descriptionPodcast);
        formDataPodcast.append('img', imgPodcast);
        formDataPodcast.append('userId', userId);

        // let lastPodcastId;
        const formDataCategory = new FormData();
        const categoryId = document.getElementById('select-category').value;
        formDataCategory.append('categoryId', categoryId);
        console.log(typeof categoryId, categoryId);

        insertPodcast(formDataPodcast);

        async function insertPodcast(data) {
            try {
                const response = await fetch('https://ecos-podcast.onrender.com/api/podcasts', {
                    method: 'POST',
                    body: data
                });
                const podcast = await response.json();
                console.log('Podcast id', podcast.id, ' Response: ', podcast);
                // lastPodcastId = podcast.id;

                if (podcast) {
                    console.log('Podcast agregado con exito');
                    insertCategories(podcast.id, formDataCategory);
                }

            } catch (error) {
                console.error(error);
            }
        }

        async function insertCategories(podcastId, categoryId) {
            console.log('Data para insertar categorías:', categoryId);
            const response = await fetch(`https://ecos-podcast.onrender.com/api/categories/${podcastId}`, {
                method: 'POST',
                body: categoryId
            });
            const categories = await response.json();
            if (categories.affectedRows > 0) {
                console.log('Podcast y categorías agregado con exito');
                podcastForm.reset();
                uploadModal.style.display = 'none';
                window.location.reload();
            }

        }

    });

    async function getAllCategories() {
        try {
            const response = await fetch('https://ecos-podcast.onrender.com/api/categories');
            const categories = await response.json();
            const selectCategory = document.getElementById('select-category');
            const selectCategoryEdit = document.getElementById('select-category-edit');
            for (const category of categories) {
                // Crear una opción para selectCategory
                const option1 = document.createElement('option');
                option1.value = category.id;
                option1.textContent = category.name;
                selectCategory.appendChild(option1);

                // Crear una opción separada para selectCategoryEdit
                const option2 = document.createElement('option');
                option2.value = category.id;
                option2.textContent = category.name;
                selectCategoryEdit.appendChild(option2);
            }
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }

    try {
        // Obtener podcasts
        const response = await fetch(`https://ecos-podcast.onrender.com/api/podcasts/user/search?userId=${userId}`);
        const podcasts = await response.json();

        for (const podcast of podcasts) {
            const podcastDiv = document.createElement('div');
            podcastDiv.classList.add('podcast');

            const img = document.createElement('img');
            img.src = `${podcast.img_secure_url}`;
            img.alt = podcast.title;
            podcastDiv.appendChild(img);

            const podcastContent = document.createElement('div');
            podcastContent.classList.add('podcast-content');

            const podcastHeader = document.createElement('div');
            podcastHeader.classList.add('podcast-header');

            const options = document.createElement('div');
            options.classList.add('options');
            options.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            podcastHeader.appendChild(options);

            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `
                <a href="#" onclick="openModalEditPodcast( 'true', ${podcast.id}, '${podcast.title}', '${podcast.description}')">Editar Podcast</a>
                <a href="#" onclick="deletePodcast(${podcast.id})">Eliminar Podcast</a>
            `;
            podcastDiv.appendChild(popup);

            options.addEventListener('click', () => {
                popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
            });

            podcastContent.appendChild(podcastHeader);

            const h2 = document.createElement('h2');
            h2.textContent = `Podcast: ${podcast.title}`;
            podcastContent.appendChild(h2);

            const categoryP = document.createElement('p');
            categoryP.textContent = `Categoría: `;
            categoryP.classList.add('category-list');
            podcastContent.appendChild(categoryP);

            // obteniendo categoría
            const categoriesResponse = await fetch(`https://ecos-podcast.onrender.com/api/categories/${podcast.id}`);
            const categories = await categoriesResponse.json();

            // Mostrar categorías
            if (Array.isArray(categories)) {
                let count = 0;
                for (const category of categories) {
                    categoryP.textContent += `${category.name}${count < categories.length - 1 ? ', ' : ''}`;
                    count++;
                }
            } else {
                categoryP.textContent += 'No hay categorías';
            }

            const descriptionP = document.createElement('p');
            descriptionP.textContent = podcast.description;
            podcastContent.appendChild(descriptionP);

            const episodeList = document.createElement('ul');
            episodeList.classList.add('episodes');

            // Obtener episodios
            const episodesResponse = await fetch(`https://ecos-podcast.onrender.com/api/podcasts/${podcast.id}/episodes`);
            const episodes = await episodesResponse.json();

            if (Array.isArray(episodes)) {
                for (const episode of episodes) {
                    const episodeItem = document.createElement('li');

                    const episodeImg = document.createElement('img');
                    episodeImg.src = `${episode.img_secure_url}`;
                    episodeImg.alt = `Episode ${episode.id}`;
                    episodeItem.appendChild(episodeImg);

                    const episodeTitle = document.createElement('span');
                    episodeTitle.textContent = `${episode.title} - ${episode.description}`;
                    episodeItem.appendChild(episodeTitle);

                    const playIcon = document.createElement('i');
                    playIcon.classList.add('fas', 'fa-play-circle');
                    playIcon.addEventListener('click', () => {
                        playEpisode(podcast, episode);
                    });
                    episodeItem.appendChild(playIcon);

                    const episodeOptions = document.createElement('div');
                    episodeOptions.classList.add('episode-options');
                    episodeOptions.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
                    episodeItem.appendChild(episodeOptions);

                    const episodePopup = document.createElement('div');
                    episodePopup.classList.add('episode-popup');
                    episodePopup.innerHTML = `
                                                <a href="#">Editar Episodio</a>
                                                <a href="#" onclick="deleteEpisode(${episode.id})">Eliminar Episodio</a>
                                            `;
                    episodeItem.appendChild(episodePopup);

                    episodeOptions.addEventListener('click', () => {
                        episodePopup.style.display = episodePopup.style.display === 'none' ? 'block' : 'none';
                    });

                    episodeList.appendChild(episodeItem);
                }
            } else {
                const episodeItem = document.createElement('li');
                episodeItem.textContent = 'No hay episodios';
                episodeList.appendChild(episodeItem);
            }

            podcastContent.appendChild(episodeList);
            podcastDiv.appendChild(podcastContent);

            const uploadDiv = document.createElement('div');
            uploadDiv.classList.add('upload', 'btn', 'add-episode');
            uploadDiv.innerHTML = '<i class="fas fa-upload"></i> Subir Episodio';
            uploadDiv.addEventListener('click', () => openModal(false, podcast.id));
            podcastDiv.appendChild(uploadDiv);

            podcastContainer.appendChild(podcastDiv);
        }
    } catch (error) {
        console.error('Error al obtener los podcasts:', error);
    }

    window.deletePodcast = function (id) {
        fetch(`https://ecos-podcast.onrender.com/api/podcasts/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Podcast eliminado con exito:', data);
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
    };

    window.deleteEpisode = function (id) {
        fetch(`https://ecos-podcast.onrender.com/api/episodes/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Episodio eliminado con exito:', data);
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
    }

    window.openModalEditPodcast = function (isEdit = false, podcastId, podcastTitle, podcastDescription) {

        const podcastFormEdit = document.getElementById('editPodcastForm');

        if (isEdit) {
            uploadModal.style.display = 'block';
            modalTitle.textContent = 'Actualizar Podcast';
            podcastFormEdit.style.display = 'block';
            episodeForm.style.display = 'none';
            podcastForm.style.display = 'none';

            // Cargar el formulario con los datos del podcast
            const titleForm = document.getElementById('title-podcast-edit');
            const descriptionForm = document.getElementById('description-podcast-edit');

            titleForm.value = podcastTitle;
            descriptionForm.value = podcastDescription;

            function submitHandler(event) {
                event.preventDefault();
                const formDataPodcast = new FormData();
                formDataPodcast.append('title', titleForm.value);
                formDataPodcast.append('description', descriptionForm.value);

                console.log(formDataPodcast);
                editPodcast(podcastId, formDataPodcast);
            }

            // Añadir el nuevo listener de submit
            podcastFormEdit.addEventListener('submit', submitHandler);

        } else {
            uploadModal.style.display = 'block';
            podcastFormEdit.reset();
            podcastFormEdit.style.display = 'none';
        }
    };

    window.editPodcast = function (id, formData) {
        fetch(`https://ecos-podcast.onrender.com/api/podcasts/${id}`, {
            method: 'PATCH',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Podcast editado con exito:', data);
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
    };



    function playEpisode(podcast, episode) {
        audioPlayer.src = episode.audio_secure_url; // Asume que el episodio tiene una URL de audio
        episodeCover.src = `${episode.img_secure_url}`;
        episodeTitleElement.textContent = `${episode.title} - ${podcast.host}`;
        podcastHost.textContent = `Host: ${podcast.host}`;
        audioPlayer.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
    }

    audioPlayer.addEventListener('play', () => {
        playIcon.classList.replace('fa-play', 'fa-pause');
    });

    audioPlayer.addEventListener('pause', () => {
        playIcon.classList.replace('fa-pause', 'fa-play');
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTimeElement.textContent = formatTime(currentTime);
        durationElement.textContent = formatTime(duration);
    });

    window.togglePlay = () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    };

    window.setVolume = (value) => {
        audioPlayer.volume = value / 100;
    };

    window.prevTrack = () => { };
    window.nextTrack = () => { };

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = Math.floor(seconds % 60);
        return `${minutes}:${secondsPart < 10 ? '0' : ''}${secondsPart}`;
    }

    function Spinner() {

        const divSpinner = document.createElement('div');
        divSpinner.classList.add('sk-fading-circle');

        divSpinner.innerHTML = `
                        <div class="sk-circle1 sk-circle"></div>
                        <div class="sk-circle2 sk-circle"></div>
                        <div class="sk-circle3 sk-circle"></div>
                        <div class="sk-circle4 sk-circle"></div>
                        <div class="sk-circle5 sk-circle"></div>
                        <div class="sk-circle6 sk-circle"></div>
                        <div class="sk-circle7 sk-circle"></div>
                        <div class="sk-circle8 sk-circle"></div>
                        <div class="sk-circle9 sk-circle"></div>
                        <div class="sk-circle10 sk-circle"></div>
                        <div class="sk-circle11 sk-circle"></div>
                        <div class="sk-circle12 sk-circle"></div>
                    `;

        formSpinner.appendChild(divSpinner);

    }

});