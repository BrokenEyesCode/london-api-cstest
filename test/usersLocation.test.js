const {
    getAllLondonUsers, 
    getAllUsers, 
    getCityUsers, 
    within_radius, 
    getUsersWithinXMiles, 
    getDistFromCoOrds, 
    getMilesFromMeters} = require('../src/usersLocation.js');
const fs = require('fs');
const {getData} = require('../src/httpsRequest')
jest.mock('../src/httpsRequest.js')

// Mocked data.
const getMockedUsers = () => {
    let rawData = fs.readFileSync('./test/userData.fixture.json');
    return JSON.parse(rawData);   
}
const getMockedCityUsers = () => {
    let rawData = fs.readFileSync('./test/cityFilteredUsers.fixture.json');
    return JSON.parse(rawData);
}

describe("Test suit for user location", () => {
    beforeEach(() => {    
        getData.mockResolvedValue(getMockedUsers())          
    })
    afterEach(() => {      
        jest.resetAllMocks();
    })

    test('Should return list of all users', async () => {
        getData.mockResolvedValue(getMockedUsers())
        return await getAllUsers().then(data => {
            expect(data.length).toBe(8);
        });
    });
    test('Should return list of users who city is London', async () => {
        getData.mockResolvedValue(getMockedCityUsers())
        return await getCityUsers().then(data => {
            expect(data.length).toBe(6);
        });
    });
    test('Should return a user location coordinates', () => {
        let data = getMockedUsers()        
        expect(data[0].latitude).toBe(34.003135);
        expect(data[0].longitude).toBe(-117.7228641);
    });
    test('Should return true if greater than given, false if not', () =>{
        let data = getMockedUsers()
        let londonUser = data[7]
        let notLondonUser = data[6]
        expect(within_radius(londonUser,50)).toBeTruthy()        
        expect(within_radius(notLondonUser,50)).toBeFalsy()
    });

    test('Should return true for a location within 50 miles of London.', () => {
        let location = {
            latitude: 51.885,
            longitude: 0.85
        } // 49 miles.
        expect(within_radius(location,50)).toBeTruthy()        
    })
    test('Should return a filtered set of users', () =>{
        let data = getMockedUsers()
        expect(getUsersWithinXMiles(data, 50).length).toBe(1);
    });
    test('Should convert meters to miles', () => {
        expect(Math.round(getMilesFromMeters(1609))).toBe(1);
    })
    test('Should return distance from start to end point', () => {
        let user = getMockedUsers()[0];
        expect (getDistFromCoOrds(user)).toBe(8742859)
    })
    test('Should return all users listed as london or located within 50 miles', async () => {
        jest.mock('../src/usersLocation.js')
        const index = require('../src/usersLocation.js');
        index.getCityUsers.mockReturnValue(getMockedCityUsers())
        index.getAllUsers.mockReturnValue(getAllUsers())
        return await getAllLondonUsers().then((users) => {
            expect(users.length).toBe(9);
        })        
    })
});    