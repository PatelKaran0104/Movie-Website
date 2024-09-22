// Constants
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = 'd0bfb3db92119f434f15921720533c9f';

// Utility functions
const fetchData = async (url) => {
    try {
        const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}api_key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Movie-related functions
const createMovieCard = (movie, index) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', window.innerWidth <= 1024 ? index * 25 : index * 50);

    const imageUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;

    card.innerHTML = `
        <div class="movie-poster-container">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="${movie.title || movie.name}" class="movie-poster" loading="lazy">`
            : `<div class="movie-poster placeholder-poster">
                    <i class="fas fa-film fa-4x"></i>
                   </div>`
        }
            <div class="movie-rating">${movie.vote_average?.toFixed(1)}</div>
            <button class="trailer-btn">Watch ${movie.media_type === 'tv' ? 'Show' : 'Movie'}</button>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title || movie.name}</h3>
            <p class="text-sm text-gray-300 mb-2">${movie.release_date || movie.first_air_date ? (movie.release_date || movie.first_air_date).split('-')[0] : 'N/A'}</p>
            <p class="text-sm text-gray-400">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No overview available'}</p>
        </div>
    `;

    card.querySelector('.trailer-btn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `details.html?type=${movie.media_type || 'movie'}&id=${movie.id}`;
    });

    return card;
};

const loadMovies = async (url, container, page = 1) => {
    try {
        const data = await fetchData(`${url}&page=${page}`);
        const movieContainer = document.querySelector(container);
        if (movieContainer) {
            data.results.forEach((movie, index) => {
                movieContainer.appendChild(createMovieCard(movie, index));
            });
        }
        return data;
    } catch (error) {
        console.error('Error loading movies:', error);
        throw error;
    }
};

// Page-specific functions
const loadRecommendedMovies = async () => {
    try {
        const data = await fetchData(`${BASE_URL}/movie/popular?language=en-US&page=1`);
        const movieContainer = document.querySelector('.recommended');
        if (movieContainer) {
            movieContainer.innerHTML = ''; // Clear existing content
            data.results.slice(0, 8).forEach((movie, index) => {
                movieContainer.appendChild(createMovieCard(movie, index));
            });
        }
    } catch (error) {
        console.error('Error loading recommended movies:', error);
    }
};

// Global variables
let page = 1;
let currentGenre = '';
let searchQuery = '';

const buildMovieUrl = () => {
    if (searchQuery) {
        return `${BASE_URL}/search/multi?query=${encodeURIComponent(searchQuery)}&language=en-US`;
    } else if (currentGenre) {
        return `${BASE_URL}/discover/movie?with_genres=${currentGenre}&language=en-US`;
    } else {
        return `${BASE_URL}/movie/popular?language=en-US`;
    }
};

let isLoading = false;

const loadActionMovies = async () => {
    if (isLoading) return;
    isLoading = true;

    const movieContainer = document.getElementById('movieContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!movieContainer || !loadingIndicator || !loadMoreBtn) return;

    loadingIndicator.classList.remove('hidden');

    try {
        const url = buildMovieUrl();
        const data = await fetchData(`${url}&page=${page}`);

        if (page === 1) {
            movieContainer.innerHTML = ''; // Clear existing movies only on the first page
        }

        data.results.forEach((item, index) => {
            if (item.media_type === 'movie' || item.media_type === 'tv' || !item.media_type) {
                movieContainer.appendChild(createMovieCard(item, index));
            }
        });

        page++;
        const hasMoreItems = page <= data.total_pages;
        loadMoreBtn.classList.toggle('hidden', !hasMoreItems);

        AOS.refresh();
    } catch (error) {
        console.error('Error loading movies and TV shows:', error);
        if (page === 1) {
            movieContainer.innerHTML = '<p class="text-red-500">Error loading content. Please try again.</p>';
        }
    } finally {
        loadingIndicator.classList.add('hidden');
        isLoading = false;
    }
};

const loadGenres = async () => {
    try {
        const data = await fetchData(`${BASE_URL}/genre/movie/list?language=en`);
        const genreFilter = document.getElementById('genreFilter');
        if (genreFilter) {
            genreFilter.innerHTML = '<option value="">All Genres</option>'; // Clear existing options and add default
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading genres:', error);
    }
};

const updatePageTitle = () => {
    const pageTitle = document.getElementById('pageTitle');
    const genreFilter = document.getElementById('genreFilter');
    if (!pageTitle) return;

    let titleText = 'Popular Movies & TV Shows';

    if (searchQuery) {
        titleText = `Search Results for "${searchQuery}"`;
    } else if (currentGenre && genreFilter) {
        const selectedOption = Array.from(genreFilter.options).find(opt => opt.value === currentGenre);
        if (selectedOption) {
            titleText = `${selectedOption.text} Movies & TV Shows`;
        }
    }

    pageTitle.textContent = titleText;
};

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeAOS();
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/') {
        initializeHomePage();
    } else if (path.includes('action.html')) {
        initializeActionPage();
    }

    window.addEventListener('resize', debounce(() => {
        AOS.refresh();
        initializeAOS();
    }, 250));

    if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 30);
        }
    }
});

const initializeAOS = () => {
    const isSmallScreen = window.innerWidth <= 1024;
    AOS.init({
        duration: isSmallScreen ? 600 : 1200,
        once: true,
        easing: 'ease-in-out',
        offset: isSmallScreen ? 30 : 50
    });
};

const initializeHomePage = () => {
    if (document.querySelector('.recommended')) {
        loadRecommendedMovies();
    }
    if (document.getElementById('genreButtons')) {
        createGenreButtons();
    }
};

const initializeActionPage = () => {
    initializeAOS();
    loadGenres().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const genreParam = urlParams.get('genre');
        const searchParam = urlParams.get('search');

        if (genreParam) {
            currentGenre = genreParam;
            const genreFilter = document.getElementById('genreFilter');
            if (genreFilter) {
                genreFilter.value = genreParam;
            }
        } else if (searchParam) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = searchParam;
                searchQuery = searchParam;
            }
        } else {
            // If no genre or search query, load popular movies
            currentGenre = '';
            searchQuery = '';
        }
        updatePageTitle();
        loadActionMovies();
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadActionMovies);
    }

    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
        genreFilter.addEventListener('change', handleGenreChange);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
};

const handleGenreChange = (e) => {
    currentGenre = e.target.value;
    searchQuery = ''; // Reset search query when changing genre
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    resetMovieList();
    updatePageTitle();
    loadActionMovies();
};

const handleSearch = (e) => {
    searchQuery = e.target.value;
    currentGenre = ''; // Reset genre when searching
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) {
        genreFilter.value = '';
    }
    resetMovieList();
    updatePageTitle();
    loadActionMovies();
};

const resetMovieList = () => {
    page = 1;
    const movieContainer = document.getElementById('movieContainer');
    if (movieContainer) {
        movieContainer.innerHTML = '';
    }
};

// Keyboard shortcut for search
document.addEventListener('keydown', (event) => {
    if (event.key === '/' && event.target.tagName !== 'INPUT') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            event.preventDefault();
            searchInput.focus();
        }
    }
});

const showPopup = (popupId) => {
    document.getElementById(popupId).classList.remove('hidden');
}

const hidePopup = (popupId) => {
    document.getElementById(popupId).classList.add('hidden');
}

const getNotified = (inputId, planType) => {
    const emailInput = document.getElementById(inputId);
    const email = emailInput.value.trim();
    const messageElement = document.getElementById(inputId.replace('Email', 'Message'));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.textContent = 'Please enter a valid email address.';
        messageElement.className = 'mt-2 text-sm text-center text-red-500';
        return;
    }

    setTimeout(() => {
        console.log(`Email ${email} saved for ${planType} Plan notifications`);
        messageElement.textContent = `Thank you! We'll notify you when the ${planType} Plan is available.`;
        messageElement.className = 'mt-2 text-sm text-center text-green-500';
        emailInput.value = '';

        setTimeout(() => {
            messageElement.textContent = '';
            hidePopup(inputId.replace('Email', 'Popup'));
        }, 3000);
    }, 1000);
};

const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('open');
    }
};

const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const createGenreButtons = async () => {
    try {
        const data = await fetchData(`${BASE_URL}/genre/movie/list?language=en`);
        const genreButtonsContainer = document.getElementById('genreButtons');

        if (!genreButtonsContainer) return;

        genreButtonsContainer.innerHTML = ''; // Clear existing buttons

        const colors = [
            'bg-blue-600 hover:bg-blue-700',
            'bg-green-600 hover:bg-green-700',
            'bg-red-600 hover:bg-red-700',
            'bg-purple-600 hover:bg-purple-700',
            'bg-yellow-500 hover:bg-yellow-600',
            'bg-pink-500 hover:bg-pink-600',
            'bg-indigo-600 hover:bg-indigo-700',
            'bg-gray-600 hover:bg-gray-700'
        ];

        data.genres.forEach((genre, index) => {
            const button = document.createElement('a');
            button.href = `action.html?genre=${encodeURIComponent(genre.id)}`;
            button.className = `genre-tag ${colors[index % colors.length]} text-white px-4 py-2 rounded-full cursor-pointer text-sm md:text-lg transition duration-300`;
            button.textContent = genre.name;
            genreButtonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error creating genre buttons:', error);
    }
};

// Email subscription form handling
document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const subscriptionMessage = document.getElementById('subscriptionMessage');

    if (subscribeForm && emailInput && subscriptionMessage) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (isValidEmail(email)) {
                subscriptionMessage.textContent = 'Thank you for subscribing!';
                subscriptionMessage.style.color = '#4CAF50';
                emailInput.value = '';
            } else {
                subscriptionMessage.textContent = 'Please enter a valid email address.';
                subscriptionMessage.style.color = '#F44336';
            }
        });
    }
});

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Search functionality
const setupSearch = () => {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');

    if (!searchContainer || !searchInput || !searchButton || !searchResults) return;

    let isSearchResultsVisible = false;

    const performSearch = debounce(async () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        try {
            const data = await fetchData(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1`);
            displayResults(data.results.slice(0, 5));
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<p class="p-4 text-red-500 text-center">An error occurred while searching. Please try again.</p>';
            showSearchResults();
        }
    }, 300);

    const displayResults = (results) => {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="p-4 text-gray-400 text-center">No results found</p>';
        } else {
            const resultsList = document.createElement('div');
            resultsList.className = 'py-2';

            results.forEach(item => {
                const resultItem = createResultItem(item);
                resultsList.appendChild(resultItem);
            });

            const moreMoviesItem = createMoreMoviesItem();
            resultsList.appendChild(moreMoviesItem);
            searchResults.appendChild(resultsList);
        }
        showSearchResults();
    };

    const createResultItem = (item) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'flex items-center p-3 hover:bg-gray-700 transition duration-300 cursor-pointer';

        const { imageUrl, title, subtitle, icon } = getItemDetails(item);

        resultItem.innerHTML = `
            <div class="w-12 h-18 mr-4 flex items-center justify-center bg-gray-600 rounded-md overflow-hidden">
                ${imageUrl
                ? `<img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover">`
                : `<i class="fas ${icon} text-gray-400 text-2xl"></i>`
            }
            </div>
            <div class="flex-grow">
                <p class="text-white font-semibold">${title}</p>
                <p class="text-sm text-gray-400">${subtitle}</p>
            </div>
            <i class="fas ${icon} text-blue-400 ml-2"></i>
        `;

        resultItem.addEventListener('click', () => {
            window.location.href = `details.html?type=${item.media_type}&id=${item.id}`;
        });

        return resultItem;
    };

    const getItemDetails = (item) => {
        let imageUrl, title, subtitle, icon;
        if (item.media_type === 'movie') {
            imageUrl = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
            title = item.title;
            subtitle = `Movie (${item.release_date?.split('-')[0] || 'N/A'})`;
            icon = 'fa-film';
        } else if (item.media_type === 'tv') {
            imageUrl = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null;
            title = item.name;
            subtitle = `TV Show (${item.first_air_date?.split('-')[0] || 'N/A'})`;
            icon = 'fa-tv';
        } else if (item.media_type === 'person') {
            imageUrl = item.profile_path ? `${IMAGE_BASE_URL}${item.profile_path}` : null;
            title = item.name;
            subtitle = 'Actor';
            icon = 'fa-user';
        }
        return { imageUrl, title, subtitle, icon };
    };

    const createMoreMoviesItem = () => {
        const moreMoviesItem = document.createElement('div');
        moreMoviesItem.className = 'p-2 hover:bg-gray-700 cursor-pointer text-center font-bold';
        moreMoviesItem.textContent = 'View All Results';
        moreMoviesItem.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            const query = searchInput ? searchInput.value.trim() : '';
            window.location.href = `action.html?search=${encodeURIComponent(query)}`;
        });
        return moreMoviesItem;
    };

    const showSearchResults = () => {
        if (!isSearchResultsVisible) {
            isSearchResultsVisible = true;
            searchResults.classList.remove('hidden');
            updateSearchResultsPosition();
        }
    };

    const hideSearchResults = () => {
        isSearchResultsVisible = false;
        searchResults.classList.add('hidden');
    };

    const updateSearchResultsPosition = () => {
        if (isSearchResultsVisible) {
            const rect = searchContainer.getBoundingClientRect();
            searchResults.style.position = 'fixed';
            searchResults.style.width = `${rect.width}px`;
            searchResults.style.left = `${rect.left}px`;
            searchResults.style.top = `${Math.min(rect.bottom, window.innerHeight - 10)}px`;
        }
    };

    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);

    document.addEventListener('click', (event) => {
        if (!searchContainer.contains(event.target) && !searchResults.contains(event.target)) {
            hideSearchResults();
        }
    });

    window.addEventListener('resize', updateSearchResultsPosition);
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateSearchResultsPosition);
    });
};

// Movie details modal
const setupMovieModal = () => {
    const modal = document.getElementById('movieModal');
    const modalContent = document.getElementById('movieModalContent');
    const closeModal = document.getElementById('closeModal');

    if (!modal || !modalContent || !closeModal) return;

    const showMovieDetails = async (item) => {
        modalContent.innerHTML = '<p class="text-center">Loading...</p>';
        modal.classList.remove('hidden');

        try {
            const details = await fetchData(`${BASE_URL}/${item.media_type}/${item.id}?language=en-US`);
            modalContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">${details.title || details.name}</h2>
                <img src="${details.poster_path ? `${IMAGE_BASE_URL}${details.poster_path}` : '/path/to/placeholder-image.jpg'}" 
                     alt="${details.title || details.name}" 
                     class="w-full max-w-sm mb-4">
                <p class="mb-2"><strong>Release Date:</strong> ${details.release_date || details.first_air_date || 'N/A'}</p>
                <p class="mb-2"><strong>Rating:</strong> ${details.vote_average ? `${details.vote_average.toFixed(1)}/10` : 'N/A'}</p>
                <p class="mb-4"><strong>Overview:</strong> ${details.overview || 'No overview available'}</p>
                <p><strong>Genres:</strong> ${details.genres ? details.genres.map(genre => genre.name).join(', ') : 'N/A'}</p>
            `;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            modalContent.innerHTML = '<p class="text-center text-red-500">Error loading details. Please try again.</p>';
        }
    };

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });

    return showMovieDetails;
};

// Main initialization
const initializeApp = () => {
    setupSearch();
    const showMovieDetails = setupMovieModal();

    // Add event listeners for movie cards
    document.addEventListener('click', (event) => {
        if (event.target.closest('.movie-card')) {
            const movieId = event.target.closest('.movie-card').dataset.movieId;
            if (movieId) {
                showMovieDetails({ media_type: 'movie', id: movieId });
            }
        }
    });

    // Initialize other components
    initializeAOS();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeHomePage();
    } else if (window.location.pathname.includes('action.html')) {
        initializeActionPage();
    }

    // Add Coming Soon Popup functionality
    const portfolioButton = document.getElementById('portfolioButton');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', function (e) {
            e.preventDefault();
            showComingSoonPopup();
        });
    }
};

// Coming Soon Popup functionality
const showComingSoonPopup = () => {
    const comingSoonPopup = document.getElementById('comingSoonPopup');
    const closePopupButton = document.getElementById('closePopup');

    if (comingSoonPopup) {
        comingSoonPopup.classList.remove('hidden');

        if (closePopupButton) {
            closePopupButton.addEventListener('click', closeComingSoonPopup);
        }

        setTimeout(closeComingSoonPopup, 3000);
    }
}

const closeComingSoonPopup = () => {
    const comingSoonPopup = document.getElementById('comingSoonPopup');
    const closePopupButton = document.getElementById('closePopup');

    if (comingSoonPopup) {
        comingSoonPopup.classList.add('hidden');

        if (closePopupButton) {
            closePopupButton.removeEventListener('click', closeComingSoonPopup);
        }
    }
}

// Call the main initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
