const {getAllLondonUsers} = require('./usersLocation.js');
const express = require('express')
const app = express()
const port = 3000

app.get('/', async(req, res) => {
    let data = await getAllLondonUsers()
    res.send(data)
})

app.listen(port, () =>{
    console.log("Listening on port ", port)
})