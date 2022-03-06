# london-api-cstest
An API to return a list of users within 50 mile of London based on a given API.

This App uses the lightweight `Express` Node JS RESTful API
[Find out more about express here](https://expressjs.com)
For Ditance Calculations I used the GeoLib library
[Find our more about GeoLib at their GitHub page](https://github.com/manuelbieh/geolib#readme)
## Install
* Clone the repository.
* install node and npm 
* Install depenacies with `npm install`

## Usage
To start the application use
```
npm run start
```
Got to a browser and type `http://locathost:3000`
To stop press ctrl + c

## Tests
To run the tests use
```
    mpm test
```
## Lint
To ensure code quality, ESLint is used and ran against the applicaton.
```
    npm run lint
```    
