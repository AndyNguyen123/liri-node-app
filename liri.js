//require packages and keys from APIs
require("dotenv").config();
const keys = require('./keys.js');
const axios = require('axios');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

const inputCommand = process.argv[2];
const inputName = process.argv.filter(element => process.argv.indexOf(element) >= 3).join(' ');

//get the latest 20 tweets and display its contents & time created; twitter defaults at 20 counts
const getTweet = () => {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        var tweetDisplay = tweets.map(element => {
            return `Tweet: ${element.text}           Created at: ${element.created_at}`
        });
        console.log(tweetDisplay);
    });
}

// get song info from Spotify and display its info
const getSong = (inputSong) => {
    let song;
    if (!inputSong) {
        song = 'Panda';
    }
    else song = inputSong;
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        const firstSongOption = data.tracks.items[0];
        const artists = firstSongOption.album.artists.map(artistObject => artistObject.name).join(', ');
        const songTitle = firstSongOption.name;
        const previewURL = firstSongOption.album.external_urls.spotify;
        const albumName = firstSongOption.album.name;
        console.log(
            `Artist(s): ${artists}
Song: ${songTitle}
Preview URL: ${previewURL}
Album: ${albumName}
            `);
    });
}

//get movie info from OMDB api and display
const getMovie = (inputMovie) => {
    let movieName;

    if (!inputMovie) movieName = 'Up';
    else movieName = inputMovie;

    const omdbURL = `https://omdbapi.com/?t=${movieName}&apikey=trilogy`;
    axios.get(omdbURL)
        .then(function (resp) {
            // console.log(resp.data);
            if (resp.data.Response === 'False') console.log('No Movie Found!');
            else {

                const movieData = resp.data;
                const movieTitle = movieData.Title;
                const movieYear = movieData.Year;
                const imdbRating = movieData.imdbRating;
                let rottenTomatoRating;
                movieData.Ratings.forEach(object => {
                    if (object.Source === 'Rotten Tomatoes') {
                        rottenTomatoRating = object.Value;
                    }
                });
                const country = movieData.Country;
                const language = movieData.Language;
                const plot = movieData.Plot;
                const actors = movieData.Actors;

                console.log(
                    `Title: ${movieTitle}
Year: ${movieYear}
IMDB Rating: ${imdbRating}
Rotten Tomatoes Rating: ${rottenTomatoRating}
Country: ${country}
Language: ${language}
Plot: ${plot}
Actors: ${actors}`
                )
            }
        })
        .catch(function (err) { console.error(err) });
}

//function to run liri based on user input
const runLIRI = (command, name) => {
    if (command == 'my-tweets') {
        getTweet();
    }
    else if (command == 'spotify-this-song') {
        getSong(name);
    }
    else if (command == 'movie-this') {
        getMovie(name);
    }
    else if (command == 'do-what-it-says') {
        fs.readFile('./random.txt', 'utf8', (err, data) => {
            if (err) throw err;
            commandInFile = data.split(',')[0];
            nameInFile = data.split(',')[1];
            runLIRI(commandInFile, nameInFile);
        })
    }
}

runLIRI(inputCommand, inputName);