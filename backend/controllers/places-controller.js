const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'V Mart',
        description: 'The best place for shopping!',
        address: '716, Mangalam Marriage Hall, Medical College Road, Shahpur, Gorakhpur, Uttar Pradesh 273001',
        location: {
          lat: 26.77368,
          lng: 83.3813757
        },
        creator: 'u1'
      }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);
    if(!place) {
        throw new HttpError('Could not find a place for given place id.', 404);
    }
    res.json({place});
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);
    if(!places || places.length === 0) {
        return next(new HttpError('Could not find places for given user id.', 404));
    }
    res.json({places});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const {title, description, address, creator} = req.body;

    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    }
    catch(error) {
        return next(error);
    }
    
    const createdPlace = {
        id: uuid(),
        title,
        description,
        address,
        creator,
        location: coordinates,
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace});
};

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;

    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place for this id', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'Deleted place'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;