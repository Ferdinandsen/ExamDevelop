'use strict';

var _ = require('lodash');
var Highscore = require('./highscore.model');

var d = new Date(),
    month = d.getMonth()+1,
    year = d.getFullYear()


// Get list of highscores
exports.index = function (req, res) {
    console.log('index');
    var highscoreInfo = {};
    Highscore.find({}, function (err, highscores) {
        if (err) {
            return handleError(res, err);
        }
        highscoreInfo.all = highscores;
        console.log(month+" "+year);
        Highscore.find({date: { $lt: new Date(), $gte: new Date(year+','+month+',1') }})
            .sort('-score').limit(10).exec(function (err, highscoresSorted) {
                if (err) {
                    return handleError(res, err);
                }
                highscoreInfo.sorted10 = highscoresSorted;

                Highscore.find()
                    .sort('-score').limit(5).exec(function (err, highscoresSorted) {
                        if (err) {
                            return handleError(res, err);
                        }
                        highscoreInfo.sorted5 = highscoresSorted;
                        return res.json(200, highscoreInfo);
                    });
            });
    });
};

// Get a single highscore
exports.show = function (req, res) {
    Highscore.findById(req.params.id, function (err, highscore) {
        if (err) {
            return handleError(res, err);
        }
        if (!highscore) {
            return res.send(404);
        }
        return res.json(highscore);
    });
};

// Creates a new highscore in the DB.
exports.create = function (req, res) {
    Highscore.create(req.body, function (err, highscore) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, highscore);
    });
};

// Updates an existing highscore in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Highscore.findById(req.params.id, function (err, highscore) {
        if (err) {
            return handleError(res, err);
        }
        if (!highscore) {
            return res.send(404);
        }
        var updated = _.merge(highscore, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, highscore);
        });
    });
};

// Deletes a highscore from the DB.
exports.destroy = function (req, res) {
    Highscore.findById(req.params.id, function (err, highscore) {
        if (err) {
            return handleError(res, err);
        }
        if (!highscore) {
            return res.send(404);
        }
        highscore.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
};
//
////Returns a sorted list of highscores.
//exports.sortedlist = function (req, res) {
//    console.log('ost');
//    Highscore.find()
//        .sort('-score').exec(function (err, highscores) {
//            if (err) {
//                return handleError(res, err);
//            }
//            return res.json(200, highscores);
//        });
//};