//require packages and keys from APIs
require("dotenv").config();
const keys = require('./keys.js');
const axios = require('axios');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

// console.log(spotify);
// console.log(client);

//get the latest 20 tweets and display its contents & time created; twitter defaults at 20 counts
const getTweet = () => {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        var tweetDisplay = tweets.map(element => {
            return `Tweet: ${element.text}           Created at: ${element.created_at}`
        });
        console.log(tweetDisplay);
    });
}

const getSong = (song) => {
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
