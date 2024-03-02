'use strict';
import * as api from "./api.js";
import { Cache } from "./cache.js";
import { initializeSwiper } from "./swiperModule.js";

const cache = new Cache();

window.addEventListener('load', async () => {

    const search = document.getElementById('search');
    const favourites = document.getElementById('favourites');
    const homeBtn = document.getElementById('nav-home');
    const favouritesBtn = document.getElementById('nav-favourites');
    const userBtn = document.querySelector('.user');

    // Populate asynchroneously
    setTimeout(() => populateTrendingMovies(), 0);
    setTimeout(() => populateTopRatedMovies(), 0);
    setTimeout(() => populateFavourites(), 0);

    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('home')
    });

    favouritesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('favourites');
    });

    userBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('favourites');
    });

    search.addEventListener('submit', searchUpdatedHandler);
    favourites.addEventListener('click', populateFavourites);
    document.addEventListener('favouritesUpdated', populateFavourites);
});

async function populateTopRatedMovies() {
    const topRatedMoviesContainer = document.getElementById('top-rated-movies');
    const topRatedMovies = await api.getTopRatedMovies();

    renderMovieCards(topRatedMoviesContainer, topRatedMovies);
}

async function populateFavourites() {

    console.log('populateFavourites executed.');

    const container = document.querySelector('#favourites .movies-content');
    const favourites = JSON.parse(localStorage.getItem('favouriteMovies'));

    const result = await Promise.all(
        favourites.map(async movieId => cache.get(movieId, async () => await api.getDetails(movieId))));

    console.log('favouritesUpdatedHandler result:', result);
    renderMovieCards(container, result);
}

async function populateTrendingMovies() {

    console.log('populateTrendingMovies executed.')

    const trendingMovies = (await api
        .getTrendingMovies())
        .slice(0, 10);

    console.log('trendingMovies:', trendingMovies);

    const trailers = await Promise.all(trendingMovies.map(async movie => {
        return {
            details: movie,
            trailer: await api.getTrailer(movie.id),
        }
    }));

    console.log('trailers:', trailers);
    const shuffled = shuffleArray(trailers);

    updateTrailers(shuffled);
}

async function searchUpdatedHandler(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    const container = document.querySelector('#search-result .movies-content');

    let searchResult = await api.searchMovie(query);

    navigate('search');

    renderMovieCards(container, searchResult);
}

function renderMovieCards(element, items) {

    const template = document.getElementById('movie-card-template');
    var favourites = JSON.parse(localStorage.getItem('favouriteMovies'));

    element.innerHTML = '';

    items.forEach(item => {

        const card = template.content.cloneNode(true);
        const wrapper = card.querySelector('.movie-card');
        const thumbnail = card.querySelector('.movie-box-img');
        const title = card.querySelector('.movie-title');
        const genre = card.querySelector('.movie-type');
        const watchBtn = card.querySelector('.watch-btn');
        const star = card.querySelector('.fav-star');

        wrapper.setAttribute('data-id', item.id);
        thumbnail.src = item.poster_path !== null ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '../imgs/image_not_found.png';
        thumbnail.alt = item.title;
        title.textContent = item.title;
        genre.textContent = item.genre;

        if (favourites.includes(item.id))
            star.classList.add('active');

        star.addEventListener('click', () => {
            ToggleFavourite(item, wrapper, star);
        });

        wrapper
            .querySelector('.movie-title')
            .addEventListener('click', () => showMovieDetails(item));

        element.appendChild(card);
    });
}

async function showMovieDetails(movie) {
    const details = await api.getDetails(movie.id);
    const combinedGenres = details.genres.map(genre => genre.name).join(", ");

    document.getElementById('movie-details').classList.remove('d-none');
    document.getElementById('details-poster').src = `https://image.tmdb.org/t/p/w500/${details.poster_path}`;
    document.getElementById('details-poster').alt = details.title;
    document.getElementById('details-overview').textContent = details.overview;
    document.getElementById('details-genres').textContent = combinedGenres;
    document.getElementById('details-vote').textContent = `${Math.round(details.vote_average)}/10`;

    navigate('details');
}

function ToggleFavourite(movie, element, star) {

    let favourites = JSON.parse(localStorage.getItem('favouriteMovies'));

    if (!Array.isArray(favourites))
        favourites = [];

    if (favourites.includes(movie.id)) {
        console.log('Removing movie from favourites:', movie);
        const elementToRemove = favourites.indexOf(movie.id);

        favourites.splice(elementToRemove, 1);
        star.classList.remove('active');
    } else {
        console.log('Adding movie to favourites:', movie);
        favourites.push(movie.id);
        star.classList.add('active');
    }

    localStorage.setItem('favouriteMovies', JSON.stringify(favourites));

    document.dispatchEvent(new Event('favouritesUpdated', { bubbles: true }));
}


function navigate(page) {

    const pageSelectors = [
        { key: 'home', selector: 'section.home' },
        { key: 'search', selector: 'section.search' },
        { key: 'favourites', selector: 'section.favourites' },
        { key: 'details', selector: 'section.details' },
    ]

    pageSelectors.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => element.classList.add('d-none'));
    });

    const pageSelector = pageSelectors.find(item => item.key === page);
    const elementsToDisplay = document.querySelectorAll(pageSelector.selector);
    console.log('elementsToDisplay:', elementsToDisplay);

    elementsToDisplay.forEach(element => element.classList.remove('d-none'));
}



//<-----------------SWIPER TILL POPULÄRA FILMER START------------------------>
initializeSwiper();
//<-----------------SWIPER TILL POPULÄRA FILMER SLUT------------------------>




//<---------------------LILLA SEARCH FÄLTET --------------------------------->
function fetchAndDisplayMovieInfo(movieTitle) {
    // Anropa API:et med den sökta filmens titel
    fetch(`http://www.omdbapi.com/?apikey=3bef2d52&plot=full&t=${movieTitle}`)
        .then(response => response.json())
        .then(data => {
            // Skapa en sträng för att visa filmens information
            const movieInfo = `
             <h2 class"searchTitle"=>${data.Title}</h2>
            <img src="${data.Poster}" class="search-img" alt="${data.Title} Poster">
            <p class="searchTextRelese"><strong>Released:</strong> ${data.Released}</p>
                <p class="searchTextGenre"><strong>Genre:</strong> ${data.Genre}</p>
                <p class="searchTextPlot"><strong>Plot:</strong> ${data.Plot}</p>


            `;

            // Hämta det HTML-elementet där jag vill visa filmens information
            const movieInfoPopup = document.querySelector('#home');

            // Fyller i filmens information i rutan
            movieInfoPopup.innerHTML = movieInfo;

            // Visa den nya rutan med filmens information
            movieInfoPopup.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching movie information:', error);
        });
}

// Lyssna på sökevenemanget och visa filmens information när användaren söker
document.getElementById('searchBtn').addEventListener('click', function () {
    const searchInput = document.getElementById('searchInput').value;
    fetchAndDisplayMovieInfo(searchInput);
});
//<----------------------------------------------SEARCH SECTION END-------------------------------------------------->





//<-------------------------------------POPULAR SECTION - RANDOM TRAILERS----START--------------------------------->

//Hämtar Trailers från fetch.js Modulen.
//fetchTrailers();


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function updateTrailers(movies) {
    const moviesContainer = document.querySelector('.popular-content .swiper-wrapper');
    // Ta bort befintliga filmer från moviesContainer
    moviesContainer.innerHTML = '';

    movies.forEach(item => {
        // Skapa en ny swiper-slide för varje film
        const movieSlide = document.createElement('div');
        movieSlide.classList.add('swiper-slide');

        // Skapa innehållet för varje filmruta
        const movieBox = document.createElement('div');
        movieBox.classList.add('movie-card');

        const movieIframe = document.createElement('iframe');
        movieIframe.classList.add('movie-box-img');
        movieIframe.src = `https://www.youtube.com/embed/${item.trailer.key}`;
        movieIframe.alt = item.details.title;
        movieIframe.frameBorder = 0; // tar bort ful svart kant runt Frilmrutorna

        const boxText = document.createElement('div');
        boxText.classList.add('box-text');

        const movieTitle = document.createElement('h2');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = item.details.title;

        const watchBtn = document.createElement('a');
        watchBtn.classList.add('watch-btn', 'play-btn');
        watchBtn.href = `https://youtu.be/${item.trailer.key}`;
        watchBtn.target = '_blank';
        watchBtn.innerHTML = '<i class="bx bx-right-arrow"></i>';

        // Bygg upp strukturen
        boxText.appendChild(movieTitle);
        boxText.appendChild(watchBtn);
        movieBox.appendChild(movieIframe);
        movieBox.appendChild(boxText);
        movieSlide.appendChild(movieBox);

        // Lägg till den nya filmrutan i moviesContainer
        moviesContainer.appendChild(movieSlide);
    });
}

