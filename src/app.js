const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')


const app = express()

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirPath))

// # render index page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Bob Bobertson'
    })
})

// # render about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Bob Bobertson',
        description: 'This is a robot'
    })
})

// # render help page
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'You need help.',
        title: 'Help',
        name: 'Bob Bobertson'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error});
        }
    
        forecast(latitude,longitude, (error, forecastData) => {
    
            if (error) {
                return res.send({error});
            }

            res.send({
                address: req.query.address,
                forecast: forecastData,
                location
                // forecast: forecastData, location,
                // address: req.query.address
            })
        })
    })
})


app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })

})










app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Boring 404 help page placeholder'
    })
})

// 404 handler
app.get('*', (req, res) => {
    res.render('404', {
        message: 'Boring 404 placeholder'
    })
})

// Start server
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
