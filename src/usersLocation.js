"use strict";
const geolib = require('geolib');
const {getData} = require('./httpsRequest')

const LONDON_COORDS = {latitude: 51.510244, longitude: -0.12571990}
const KM_MILES_CONVERSION = 0.621371
const API_URL = 'https://bpdts-test-app.herokuapp.com/'

/**
 * Calls the data api to get all users.
 * @returns Promise Json data
 */
const getAllUsers = async() => {
    return await getData(API_URL,"/users").then((data) => data);
}

/**
 * Calls the data api to get users who's location is set to London.
 * @returns Promise Json data
 */
const getCityUsers = async() => {
    return await getData(API_URL,"/city/London/users").then((data) => data);
}

/**
 * Convert meters into miles.
 * @param {Number} meters 
 * @returns {Number}, miles converted from meters input.
 */
const getMilesFromMeters = (meters) => {
    console.log('meters: ', meters)
    return (meters / 1000) * KM_MILES_CONVERSION
}

/**
 * 
 * @param {*} user JSON representation of the user data
 * @returns {Number} distance, in meters, from the given coordinates of the user from London
 */
const getDistFromCoOrds = (user) => {
    let userLoc = {
        latitude: parseFloat(user.latitude),
        longitude: parseFloat(user.longitude)
    }
    return geolib.getDistance(LONDON_COORDS, userLoc)
}

/**
 * Tests whether the user is within the distance given.
 * @param {*} user JSON representation of the user data
 * @param {Number} dist The distance the user is away from the location.
 * @returns {boolean} True if within radius of location, false if not.
 */
const within_radius = (user, dist) => {
    return getMilesFromMeters(getDistFromCoOrds(user)) < dist
}

/**
 * returns a filtered array of the users who's location is within the distance.
 * @param {*} user JSON representation of the user data
 * @param {Number} dist The distance the user is away from the location.
 * @returns {Array} users who are within given distance of Location.
 */
const getUsersWithinXMiles = (users, dist) => {
    return users.filter((user) =>{
        return within_radius(user, dist)
    })
}

/**
 * Combine and return the users from 2 API calls.
 * @returns {*} JSON representation of the user data.
 */
const getAllLondonUsers = async() => {
    let london_city_users = await getCityUsers().then(cityData => {
        return cityData
    })
    let london_loc_users = await getAllUsers().then(allUsers => {        
        return getUsersWithinXMiles(allUsers, 50)
    })    
    return london_loc_users.concat(london_city_users)
}

/**
 * Exports to allow for unit testing.
 */
module.exports = {
    getAllUsers,
    getCityUsers,
    within_radius,
    getUsersWithinXMiles,
    getDistFromCoOrds,
    getMilesFromMeters,
    getAllLondonUsers
}