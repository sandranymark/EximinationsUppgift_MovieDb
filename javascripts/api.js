const accessKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MTdlNmNjYTNkNmRkN2JlN2M0ZGFiMjdiNGZhY2RkNCIsInN1YiI6IjY1Y2E1MzcxYjZjZmYxMDE4NWE4OGRmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZZcIVr1Mo3-sbIjcrjgi4LJN43pqQZbcQ5qXlsecta8';
const apiKey = '617e6cca3d6dd7be7c4dab27b4facdd4';
const apiBaseUrl = 'https://api.themoviedb.org/3'

async function getTrailer(movieId) {
    try {
        const response = await fetch(`${apiBaseUrl}/movie/${movieId}/videos?api_key=${apiKey}`);
        const data = await response.json();

        const result = data.results
            .filter(
                (trailer) =>
                    trailer.site === 'YouTube' &&
                    trailer.official &&
                    trailer.type === 'Trailer'
            )
            .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        if (result.length === 0)
            return null;

        return result[0];

    } catch (error) {
        console.log(error);
    }
}

async function getTopRatedMovies() {
    try {
        const response = await fetch(`${apiBaseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&api_key=${apiKey}`);
        const data = await response.json();

        return data.results;

    } catch (error) {
        console.log("Error fetching top rated movies", error);
    }
}

async function getDetails(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/movie/${id}?language=en-US&api_key=${apiKey}`);

        return await response.json();

    } catch (error) {
        console.log('Error while fetching movie details', error);
    }
}

async function getTrendingMovies() {
    try {
        const response = await fetch(`${apiBaseUrl}/trending/movie/week?api_key=${apiKey}`);
        var data = await response.json();

        return data.results;

    } catch (error) {
        console.log('Error while fetching trending movies', error);
    }

}

async function searchMovie(query) {
    try {
        const response = await fetch(`${apiBaseUrl}/search/movie?query=${query}&include_adult=false&language=en-US&api_key=${apiKey}`);
        var data = await response.json();

        return data.results;

    } catch (error) {
        console.log('Error while searching for a movie', error);
    }
}




export { getTopRatedMovies, getTrailer, searchMovie, getDetails, getTrendingMovies };