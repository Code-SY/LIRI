// Require the node package manager for Spotify, request and moment
var axios = require('axios');
var moment = require('moment');

liri(process.argv[2], getherSearchTerm(process.argv.slice(3)));

function liri(command, searchTerms) {
    switch (command) {
        case "concert-this":
            bandInfo(searchTerms);
            break;
    
        case "spotify-this-song":
            songInfo(searchTerms);
            break;
    
        case "movie-this":
            movieInfo(searchTerms);
            break;
    
        case "do-what-it-says":
            doWhatInfo();
            break;
    }
};

function getherSearchTerm(terms) {
    var result = "";

    for (var i = 0; i < terms.length; i++){
        if (i > 0 && i < terms.length){
            result = result + "+" + terms[i];
        }
        else{
            result += terms[i];
        }
    }

    return result;
};

function bandInfo(bandName) {
    var url = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
    
    console.log("URL: " + url);
    console.log("----------");

    axios.get(url).then(
        function(response) {
            if (response === null || !response.data === null || response.data.length === 0) {
                return console.log("Sorry, I cannot find anything.");
            }

            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("----------");
            }
        }
    );
};

function songInfo(songName) {
    if (songName === "") {
        songName = "The Sign, Ace of Base"
    }

    require('dotenv').config();

    var keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);

    var url = "https://api.spotify.com/v1/search?q=track:" + songName + "&type=track&limit=10";

    console.log("URL: " + url);
    console.log("----------");

    spotify.request(url, function(error, response) {
        if (error){
            return console.log(error);
        }

        if (response === null || !response.tracks === null || response.tracks.items === null || response.tracks.items === 0) {
            return console.log("Sorry, I cannot find anything.");
        }

        for (var i = 0; i < response.tracks.items.length; i++) {
            console.log("Artist: " + response.tracks.items[i].artists[0].name);
            console.log("Song: " + response.tracks.items[i].name);
            console.log("URL: " + response.tracks.items[i].preview_url);
            console.log("Album: " + response.tracks.items[i].album.name);
            console.log("----------");
        }
    });
};

function movieInfo(movieName) {
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    console.log("URL: " + url);
    console.log("----------");

    axios.get(url).then(
        function(response) {
            if (response === null || !response.data === null || response.data.Response === 'False') {
                return console.log("Sorry, I cannot find anything.");
            }
    
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("Rated: " + response.data.imdbRating);
            console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );
}

function doWhatInfo() {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }

        var parts = data.split(",");
        var command = parts[0];
        var searchTerms = parts[1];

        searchTerms = searchTerms.trim("");
        searchTerms = searchTerms.replace(/^\"?/g, "");
        searchTerms = searchTerms.replace(/\"?$/g, "");

        liri(command, getherSearchTerm(searchTerms.split(" ")));
    })
};