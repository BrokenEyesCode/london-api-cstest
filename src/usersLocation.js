"use strict";
const geolib = require('geolib');
const {getData} = require('./httpsRequest')

const LONDON_COORDS = {latitude: 51.510244, longitude: -0.12571990}
const DIST_CONVERTSION = 1.6
const API_URL = 'https://bpdts-test-app.herokuapp.com/'

const getAllUsers = async() => {
    return await getData(API_URL,"/users").then((data) => data);
}

const getCityUsers = async() => {
    return await getData(API_URL,"/city/London/users").then((data) => data);
}


const getMilesFromMeters = (meters) => {
    return meters / 1000 / DIST_CONVERTSION
}

const getDistFromCoOrds = (user) => {
    let userLoc = {
        latitude: parseFloat(user.latitude),
        longitude: parseFloat(user.longitude)
    }
    return geolib.getDistance(LONDON_COORDS, userLoc)
}

const within_radius = (user, dist) => {
    return getMilesFromMeters(getDistFromCoOrds(user)) < dist
}

const getUsersWithinXMiles = (users, dist) => {
    return users.filter((user) =>{
        return within_radius(user, dist)
    })
}

const getAllLondonUsers = async() => {
    let london_city_users = await getCityUsers().then(cityData => {
        console.log('by city:', cityData.length)
        return cityData
    })
    let london_loc_users = await getAllUsers().then(allUsers => {        
        let filteredUsers = getUsersWithinXMiles(allUsers, 50)
        console.log('By Location: ',filteredUsers.length)
        return filteredUsers
    })    
    return london_loc_users.concat(london_city_users)
}

module.exports = {
    getAllUsers,
    getCityUsers,
    within_radius,
    getUsersWithinXMiles,
    getDistFromCoOrds,
    getMilesFromMeters,
    getAllLondonUsers
}