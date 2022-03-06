const {getData} = require('../src/httpsRequest');
jest.mock('https');

const httpsMock = require("https");
const Stream = require('stream');
const fs = require('fs');

// Mocked data.
const getMockedUsers = () => {
    return fs.readFileSync('./test/userData.fixture.json');    
}

describe("Test suit for user location", () => {    
    beforeEach(() => {    

    })
    afterEach(() => {      
        jest.resetAllMocks();
    })

    test('Should make call and return data via promise', async () => {
        var streamStream = new Stream()
        httpsMock.get = jest.fn().mockImplementation((url, cb) => {
          cb(streamStream)          
          streamStream.emit('data', getMockedUsers());
          streamStream.emit('end'); // this will trigger the promise resolve
        })
        const response = await getData("server", "path");
        expect(response.length).toEqual(8);
    });
    test('Should fails with an error on json parse failure', async () => {
        var streamStream = new Stream()
        httpsMock.get = jest.fn().mockImplementation((url, cb) => {
          cb(streamStream)          
          streamStream.emit('data', 'bad json format');
          streamStream.emit('end'); // this will trigger the promise resolve
        })
        expect.assertions(1);
        try {
            await getData("server", "path");
        } catch (e) {
            expect(e).toMatch('Unexpected token b in JSON at position 0');
        }
    });
    test('Should fails with an error on http failure', async () => {
        var streamStream = new Stream()
        httpsMock.get = jest.fn().mockImplementation((url, cb) => {
          cb(streamStream)          
          streamStream.emit('error', {message: "Well that did not go to plan}"});
        })
        await expect(getData("server", "path")).rejects.toMatch('error');
    });    
});