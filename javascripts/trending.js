
const accessKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MTdlNmNjYTNkNmRkN2JlN2M0ZGFiMjdiNGZhY2RkNCIsInN1YiI6IjY1Y2E1MzcxYjZjZmYxMDE4NWE4OGRmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZZcIVr1Mo3-sbIjcrjgi4LJN43pqQZbcQ5qXlsecta8";
const apiBaseUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${accessKey}`
const moviesContainer = document.getElementById("movies");


async function fetchMovies() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${accessKey}`
        }
    };


    fetch(`${apiBaseUrl}/discover/movie`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.results.forEach(media => {
                console.log(media);
                const movieCard = createMovieCard(media);
                moviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            // Handle any errors here
            console.log('There was an error!', error);
        });
}

function createMovieCard(media) {
    const { title, name, backdrop_path, id } = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie_item")

    movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" class="movie_img_rounded">
    <div class="title" data-id="${id}">${title || name}</div>`;

    return movieCard;

}

fetchMovies();

moviesContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('title')) {
        const movieName = target.innerText;
        console.log('clicked on movie:', movieName);
    }
});

moviesContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('title')) {
        const movieName = target.innerText;
        console.log('clicked on movie:', movieName);

        // Set the URL of the new page with the movie information
        window.location.href = `movie-details.html?movie=${encodeURIComponent(movieName)}`;
    }
});



