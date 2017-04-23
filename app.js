// require the modules we need
// STOP: what are these modules? Use online documentation to read up on them.
var express = require('express');
var path = require('path');
// var fs = require('fs');
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require('body-parser');
var db = require("./models");

var app = express();

// this sets a static directory for the views
app.use(express.static(path.join(__dirname, 'static')));

// using the body parser module
app.use(bodyParser.urlencoded({ extended: false }));

app.use(ejsLayouts);
app.set('view engine', 'ejs');

// your routes here

// redirect to the /games route
app.get('/', function(req, res) {
    res.redirect('/games');
});

// display a list of all games
app.get('/games', function(req, res) {
    db.game.findAll().then(function(games) {
        res.render('games-index', { games: games });
    }).catch(function(error) {
        res.status(404).send(error);
    });
    // var games = getGames();
    // res.render('games-index', { games: games });
});

// return an HTML form for creating a new game
app.get('/games/new', function(req, res) {
    res.render('games-new');
});

// create a new game (using form data from /games/new)
app.post('/games', function(req, res) {
    // console.log(req.body);
    var newGame = req.body;
    db.game.create(newGame).then(function() {
        res.redirect('/games');
        // use this instead:
        // res.status(303).redirect('/game/' + newGame.name);
    }).catch(function(error) {
        res.status(404).send(error);
    });

    // var games = getGames();
    // games.push(newGame);
    // saveGames(games);

    // res.redirect('/games');
});

// show page
// display a specific game
app.get('/game/:name', function(req, res) {
    var nameOfTheGame = req.params.name;
    // console.log(nameOfTheGame);
    db.game.find({
        where: { name: nameOfTheGame }
    }).then(function(game) {
        // console.log(game);
        res.render('games-show', { game: game });
    }).catch(function(error) {
        res.status(404).send(error);
    });

    // var games = getGames();
    // var game = getGame(games, nameOfTheGame);

    // res.render('games-show', game);
});

// return an HTML form for editing a game
app.get('/game/:name/edit', function(req, res) {
    var nameOfTheGame = req.params.name;
    db.game.find({
        where: { name: nameOfTheGame }
    }).then(function(game) {
        // console.log(game);
        res.render('games-edit', { game: game });
    }).catch(function(error) {
        res.status(404).send(error);
    });


    // var games = getGames();
    // var game = getGame(games, nameOfTheGame);

    // res.render('games-edit', game);
});

// update a specific game (using form data from /games/:name/edit)
app.put('/game/:name', function(req, res) {
    var theNewGameData = req.body;

    var nameOfTheGame = req.params.name;
    db.game.update({
        name: theNewGameData.name,
        description: theNewGameData.description,
        numberOfPlayers: theNewGameData.numberOfPlayers
    }, {
        where: {
            name: nameOfTheGame
        }
    }).then(function() {
        res.send(req.body);
    }).catch(function(error) {
        res.status(404).send(error);
    });
    // var games = getGames();
    // var game = getGame(games, nameOfTheGame);

    // game.name = theNewGameData.name;
    // game.description = theNewGameData.description;

    // saveGames(games);

    // res.send(req.body);
});

// deletes a specific game
app.delete('/game/:name', function(req, res) {
    var nameOfTheGame = req.params.name;
    db.game.destroy({
        where: {
            name: nameOfTheGame
        }
    }).then(function() {
        // I changed the response because the destroy function does not return game data
        res.send(req.body);
    }).catch(function(error) {
        res.status(404).send(error);
    });
    // var games = getGames();
    // var game = getGame(games, nameOfTheGame);
    // var indexOfGameToDelete = games.indexOf(game);

    // games.splice(indexOfGameToDelete, 1);

    // saveGames(games);

    // res.send(game);
});

// helper functions

// function getGame(games, nameOfTheGame) {
//     var game = null;

//     for (var i = 0; i < games.length; i++) {
//         if (games[i].name.toLowerCase() == nameOfTheGame.toLowerCase()) {
//             game = games[i];
//             break;
//         }
//     }

//     return game;
// }

// Read list of games from file.
// function getGames() {
//     var fileContents = fs.readFileSync('./games.json'); // :'(
//     var games = JSON.parse(fileContents);
//     return games;
// }

// Write list of games to file.
// function saveGames(games) {
//     fs.writeFileSync('./games.json', JSON.stringify(games));
// }

// start the server

var port = 3000;
console.log("http://localhost:" + port);
app.listen(port);
