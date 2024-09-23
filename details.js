// Constants
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMGJmYjNkYjkyMTE5ZjQzNGYxNTkyMTcyMDUzM2M5ZiIsIm5iZiI6MTcyNTc5MzgyNC44MDc3NTEsInN1YiI6IjY2ZGQ4NTIwZGEzNDg2MWI2MGVlM2VmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YeX3XmLkJ7dHry3GLErNrbkmQD4xy-JIe9yJJ9U6sR8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const streamingServers = {
    'vidsrc.me': 'https://vidsrc.me/embed/',
    'vidplay.online': 'https://vidplay.online/e/',
    'vidsrc.xyz': 'https://vidsrc.xyz/embed/',
    'streamtape.com': 'https://streamtape.com/e/',
    'doodstream.com': 'https://doodstream.com/e/'
};

let selectedServer = 'vidsrc.me';
let currentMovieId = null;

// Utility functions
const fetchData = async (url) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    };
    const response = await fetch(url, options);
    return response.json();
};

const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Main functions
const loadDetails = async () => {
    const type = getUrlParameter('type');
    const id = getUrlParameter('id');
    currentMovieId = id;
    const detailsContainer = document.getElementById('detailsContainer');

    try {
        showLoadingSpinner();
        if (type === 'person') {
            await loadPersonDetails(id, detailsContainer);
        } else {
            await loadMovieOrTVDetails(type, id, detailsContainer);
        }
        hideLoadingSpinner();
    } catch (error) {
        console.error('Error fetching details:', error);
        displayError('Error loading details. Please try again.');
    }
};

const loadMovieOrTVDetails = async (type, id, container) => {
    const details = await fetchData(`${BASE_URL}/${type}/${id}?language=en-US`);
    const credits = await fetchData(`${BASE_URL}/${type}/${id}/credits?language=en-US`);
    const videos = await fetchData(`${BASE_URL}/${type}/${id}/videos?language=en-US`);

    let seasonsEpisodesHtml = '';

    if (type === 'tv') {
        const seasons = await fetchData(`${BASE_URL}/tv/${id}/season/1?language=en-US`);
        seasonsEpisodesHtml = `
            <div class="flex flex-wrap items-center gap-4 mt-6">
                <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
                    <select id="seasonSelect" class="bg-gray-700 text-white rounded-md px-3 py-2 w-full">
                        ${details.seasons.map(season => `<option value="${season.season_number}">${season.name}</option>`).join('')}
                    </select>
                </div>
                <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
                    <select id="episodeSelect" class="bg-gray-700 text-white rounded-md px-3 py-2 w-full">
                        ${seasons.episodes.map(episode => {
                            const truncatedName = episode.name.length > 30 ? episode.name.substring(0, 27) + '...' : episode.name;
                            return `<option value="${episode.episode_number}">${episode.episode_number}. ${truncatedName}</option>`;
                        }).join('')}
                    </select>
                </div>
                <div class="w-full md:w-auto">
                    <button id="watchEpisodeButton" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center">
                        <i class="fas fa-play mr-2"></i> Watch Episode
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3 mb-8 md:mb-0">
                <img src="${details.poster_path ? `${IMAGE_BASE_URL}${details.poster_path}` : ''}" 
                     alt="${details.title || details.name}" 
                     class="w-full rounded-lg shadow-lg mb-4"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hidden w-full h-full bg-gray-700 rounded-lg shadow-lg flex items-center justify-center text-white text-2xl font-bold p-4 text-center mb-4">
                    ${details.title || details.name}
                </div>
                ${type === 'movie' ? `
                    <div class="flex space-x-2">
                        <button id="trailerButton" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center">
                            <i class="fas fa-play mr-2"></i> Watch Trailer
                        </button>
                        <button id="watchMovieButton" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center">
                            <i class="fas fa-play mr-2"></i> Watch Movie
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="md:w-2/3 md:pl-8">
                <h1 class="text-4xl font-bold mb-4">${details.title || details.name}</h1>
                <p class="text-xl mb-4 text-gray-400 italic">${details.tagline || ''}</p>
                <p class="mb-4"><span class="font-semibold">Release Date:</span> ${details.release_date || details.first_air_date || 'N/A'}</p>
                <p class="mb-4"><span class="font-semibold">Rating:</span> ${details.vote_average ? `${details.vote_average.toFixed(1)}/10` : 'N/A'}</p>
                <p class="mb-4"><span class="font-semibold">Genres:</span> ${details.genres ? details.genres.map(genre => genre.name).join(', ') : 'N/A'}</p>
                <p class="mb-8"><span class="font-semibold">Overview:</span> ${details.overview || 'No overview available'}</p>
                ${seasonsEpisodesHtml}
                <h2 class="text-3xl font-bold mb-6 mt-8">Cast</h2>
                <div class="cast-grid">
                    ${credits.cast.slice(0, 10).map(actor => `
                        <div class="cast-item">
                            <div class="cast-image-container">
                                <img src="${actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : ''}" 
                                     alt="${actor.name}" 
                                     class="cast-image"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="cast-image-fallback" style="display: none;">
                                    ${actor.name.split(' ').map(n => n[0]).join('')}
                                </div>
                            </div>
                            <p class="cast-name">${actor.name}</p>
                            <p class="cast-character">${actor.character}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    if (type === 'movie') {
        // Add event listener for trailer button
        const trailerButton = document.getElementById('trailerButton');
        const trailer = videos.results.find(video => video.type === 'Trailer');

        if (trailer) {
            trailerButton.addEventListener('click', () => {
                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
            });
        } else {
            trailerButton.disabled = true;
            trailerButton.textContent = 'No Trailer Available';
            trailerButton.classList.add('bg-gray-500', 'cursor-not-allowed');
            trailerButton.classList.remove('bg-red-600', 'hover:bg-red-700');
        }

        // Add event listener for watch movie button
        const watchMovieButton = document.getElementById('watchMovieButton');
        watchMovieButton.addEventListener('click', openMovieModal);
    } else if (type === 'tv') {
        // Add event listeners for season and episode selects
        const seasonSelect = document.getElementById('seasonSelect');
        const episodeSelect = document.getElementById('episodeSelect');
        const watchEpisodeButton = document.getElementById('watchEpisodeButton');

        seasonSelect.addEventListener('change', async () => {
            const selectedSeason = seasonSelect.value;
            const episodes = await fetchData(`${BASE_URL}/tv/${id}/season/${selectedSeason}?language=en-US`);
            episodeSelect.innerHTML = episodes.episodes.map(episode => {
                const truncatedName = episode.name.length > 30 ? episode.name.substring(0, 27) + '...' : episode.name;
                return `<option value="${episode.episode_number}">${episode.episode_number}. ${truncatedName}</option>`;
            }).join('');
        });

        watchEpisodeButton.addEventListener('click', () => {
            const tvId = currentMovieId;
            openTVModal(tvId);
        });
    }
};

const loadPersonDetails = async (id, container) => {
    const person = await fetchData(`${BASE_URL}/person/${id}?language=en-US`);
    const credits = await fetchData(`${BASE_URL}/person/${id}/movie_credits?language=en-US`);

    const topCredits = credits.cast
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10);

    const shortenedBiography = person.biography.length > 300
        ? person.biography.substring(0, 300) + '...'
        : person.biography;

    container.innerHTML = `
        <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3 mb-8 md:mb-0">
                <img src="${person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : ''}" 
                     alt="${person.name}" 
                     class="w-full rounded-lg shadow-lg mb-4"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hidden w-full h-full bg-gray-700 rounded-lg shadow-lg flex items-center justify-center text-white text-2xl font-bold p-4 text-center mb-4">
                    ${person.name}
                </div>
            </div>
            <div class="md:w-2/3 md:pl-8">
                <h1 class="text-4xl font-bold mb-4">${person.name}</h1>
                <p class="mb-4"><span class="font-semibold">Birthday:</span> ${person.birthday || 'N/A'}</p>
                <p class="mb-4"><span class="font-semibold">Place of Birth:</span> ${person.place_of_birth || 'N/A'}</p>
                <div class="mb-8">
                    <span class="font-semibold">Biography:</span>
                    <p id="shortBio">${shortenedBiography}</p>
                    <p id="fullBio" class="hidden">${person.biography || 'No biography available'}</p>
                    ${person.biography.length > 300 ? `
                        <button id="readMoreBtn" class="text-blue-500 hover:text-blue-600 mt-2">Read More</button>
                    ` : ''}
                </div>
                <h2 class="text-3xl font-bold mb-6">Top 10 Movie Credits</h2>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    ${topCredits.map(credit => `
                        <div class="text-center">
                            <img src="${credit.poster_path ? `${IMAGE_BASE_URL}${credit.poster_path}` : ''}" 
                                 alt="${credit.title}" 
                                 class="w-full rounded-lg shadow-lg mb-2"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="hidden w-full h-32 bg-gray-700 rounded-lg shadow-lg flex items-center justify-center text-white text-sm font-bold p-2 text-center mb-2">
                                ${credit.title}
                            </div>
                            <p class="font-semibold text-sm">${credit.title}</p>
                            <p class="text-xs text-gray-400">${credit.character || 'N/A'}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add event listener for Read More button
    const readMoreBtn = document.getElementById('readMoreBtn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', () => {
            document.getElementById('shortBio').classList.add('hidden');
            document.getElementById('fullBio').classList.remove('hidden');
            readMoreBtn.classList.add('hidden');
        });
    }
};

const openMovieModal = () => {
    const modal = document.getElementById('movieModal');
    const modalMovieFrame = document.getElementById('modalMovieFrame');
    const modalServerSelect = document.getElementById('modalServerSelect');
    const modalFullscreenButton = document.getElementById('modalFullscreenButton');
    const closeBtn = document.getElementsByClassName('close')[0];
    const loadingIndicator = document.getElementById('loadingIndicator');

    modalMovieFrame.style.display = 'none';
    loadingIndicator.style.display = 'flex';
    modalMovieFrame.src = `${streamingServers[selectedServer]}${currentMovieId}`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modalServerSelect.value = selectedServer;
    modalServerSelect.addEventListener('change', (event) => {
        selectedServer = event.target.value;
        modalMovieFrame.style.display = 'none';
        loadingIndicator.style.display = 'flex';
        modalMovieFrame.src = `${streamingServers[selectedServer]}${currentMovieId}`;
    });

    modalFullscreenButton.addEventListener('click', toggleFullscreen);

    const closeModal = () => {
        modal.style.display = 'none';
        modalMovieFrame.src = '';
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Handle iframe load events
    modalMovieFrame.onload = () => {
        modalMovieFrame.style.display = 'block';
        loadingIndicator.style.display = 'none';
    };

    modalMovieFrame.onerror = () => {
        loadingIndicator.style.display = 'none';
        displayErrorInModal('Failed to load the movie. Please try another server.');
    };

    // Keyboard shortcuts
    const handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'f' || event.key === 'F') {
            toggleFullscreen();
        }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Clean up event listener when modal is closed
    const cleanup = () => {
        document.removeEventListener('keydown', handleKeyPress);
    };

    modal.addEventListener('hidden.bs.modal', cleanup);
};

const openTVModal = (tvId) => {
    const modal = document.getElementById('movieModal');
    const modalMovieFrame = document.getElementById('modalMovieFrame');
    const modalServerSelect = document.getElementById('modalServerSelect');
    const modalFullscreenButton = document.getElementById('modalFullscreenButton');
    const closeBtn = document.getElementsByClassName('close')[0];
    const loadingIndicator = document.getElementById('loadingIndicator');
    const seasonSelect = document.getElementById('seasonSelect');
    const episodeSelect = document.getElementById('episodeSelect');

    modalMovieFrame.style.display = 'none';
    loadingIndicator.style.display = 'flex';

    const season = seasonSelect.value;
    const episode = episodeSelect.value;
    
    modalMovieFrame.src = `https://vidsrc.to/embed/tv/${tvId}/${season}/${episode}`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modalServerSelect.value = selectedServer;
    modalServerSelect.addEventListener('change', (event) => {
        selectedServer = event.target.value;
        modalMovieFrame.style.display = 'none';
        loadingIndicator.style.display = 'flex';
        modalMovieFrame.src = `https://vidsrc.to/embed/tv/${tvId}/${season}/${episode}`;
    });

    modalFullscreenButton.addEventListener('click', toggleFullscreen);

    const closeModal = () => {
        modal.style.display = 'none';
        modalMovieFrame.src = '';
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Handle iframe load events
    modalMovieFrame.onload = () => {
        modalMovieFrame.style.display = 'block';
        loadingIndicator.style.display = 'none';
    };

    modalMovieFrame.onerror = () => {
        loadingIndicator.style.display = 'none';
        displayErrorInModal('Failed to load the episode. Please try another server.');
    };

    // Keyboard shortcuts
    const handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'f' || event.key === 'F') {
            toggleFullscreen();
        }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Clean up event listener when modal is closed
    const cleanup = () => {
        document.removeEventListener('keydown', handleKeyPress);
    };

    modal.addEventListener('hidden.bs.modal', cleanup);
};

const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
        screenfull.toggle(modalMovieFrame);
    }
};

const handleFullscreenChange = () => {
    if (screenfull.isFullscreen) {
        modalFullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i>Exit Fullscreen (F)';
        if (window.matchMedia("(max-width: 768px)").matches) {
            screen.orientation.lock("landscape").catch((error) => {
                console.error("Error locking screen orientation:", error);
            });
        }
    } else {
        modalFullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i>Fullscreen (F)';
        if (window.matchMedia("(max-width: 768px)").matches) {
            screen.orientation.unlock();
        }
    }
};

if (screenfull.isEnabled) {
    document.addEventListener(screenfull.raw.fullscreenchange, handleFullscreenChange);
}

const displayErrorInModal = (message) => {
    const modalVideoContainer = document.getElementById('modalVideoContainer');
    modalVideoContainer.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
                <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
                <h2 class="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
                <p class="text-gray-300 text-lg mb-6">${message}</p>
                <button id="retryButton" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block">
                    <i class="fas fa-redo mr-2"></i>Try Again
                </button>
            </div>
        </div>
    `;

    document.getElementById('retryButton').addEventListener('click', () => {
        openMovieModal();
    });
};

const showLoadingSpinner = () => {
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('detailsContainer').classList.add('hidden');
}

const hideLoadingSpinner = () => {
    document.getElementById('loadingSpinner').classList.add('hidden');
    document.getElementById('detailsContainer').classList.remove('hidden');
}

const displayError = (message) => {
    const container = document.getElementById('detailsContainer');
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-[50vh]">
            <div class="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
                <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
                <h2 class="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
                <p class="text-gray-300 text-lg mb-6">${message}</p>
                <a href="index.html" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-block">
                    <i class="fas fa-home mr-2"></i>Back to Home
                </a>
            </div>
        </div>
    `;
    hideLoadingSpinner();
}

document.addEventListener('DOMContentLoaded', loadDetails);