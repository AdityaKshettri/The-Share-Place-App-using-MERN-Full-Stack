const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');
const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch(err) {
        const error = new HttpError('Something went wrong, could not find the place', 500);
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Could not find place for given id.', 404);
        return next(error);
    }

    res.json({
        place: place.toObject({getters: true})
    });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    }
    catch(err) {
        const error = new HttpError('Fetching places failed, please try again later', 500);
        return next(error);
    }

    if(!userWithPlaces || userWithPlaces.length === 0) {
        const error = new HttpError('Could not find places for given user id.', 404);
        return next(error);
    }

    res.json({
        places: userWithPlaces.places.map(place => 
            place.toObject({getters: true})
        )
    });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data', 422);
        return next(error);
    }

    const {title, description, address, creator} = req.body;

    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    }
    catch(error) {
        return next(error);
    }
    
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSWMIyZ_FgCvo9LRktdT2M9_GMILvCRJaJda-qWuR5oDoLQ4Q9p&usqp=CAU',
        creator,
    });

    let user;
    try {
        user = await User.findById(creator);
    }
    catch(err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided creator id.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data', 422);
        return next(error);
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch(err) {
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    }
    catch(err) {
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    res.json({
        place: place.toObject({getters: true})
    });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    }
    catch(err) {
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Could not find a place for this id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err) {
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }
    
    res.status(200).json({message: 'Deleted place'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;