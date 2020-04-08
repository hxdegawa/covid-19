const express = require('express')
const bodyParser = require('body-parser')
// const request = require('request')
const axios = require('axios')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

let summary
let totalConfirmed = 0
let totalDeaths = 0
let totalRecovered = 0
let totalConfirmedCountries = 0

axios.get('https://api.covid19api.com/summary').then((res) => {
  totalConfirmed - 0
  totalDeaths = 0
  totalDeaths = 0
  totalRecovered = 0
  totalConfirmedCountries = 0
  confirmedLocations = []

  summary = res.data.Countries

  res.data.Countries.forEach((country) => {
    totalConfirmed += parseInt(country['TotalConfirmed'], 10)
    totalDeaths += parseInt(country['TotalDeaths'], 10)
    totalRecovered += parseInt(country['TotalRecovered'], 10)

    if (country['TotalConfirmed'] > 0) {
      totalConfirmedCountries++

      axios
        .get(
          `https://api.covid19api.com/dayone/country/${country['Slug']}/status/confirmed`
        )
        .then((Coordinates) => {
          const confirmedLocation = {}
          confirmedLocation['title'] = country['Country']
          confirmedLocation['confirmed'] = parseInt(country['TotalConfirmed'], 10)
          confirmedLocation['deaths'] = parseInt(country['TotalDeaths'], 10)
          confirmedLocation['recovered'] = parseInt(country['TotalRecovered'], 10)
          confirmedLocation['latitude'] = parseInt(Coordinates.data[0].Lat, 10)
          confirmedLocation['longitude'] = parseInt(Coordinates.data[0].Lon, 10)
          confirmedLocations.push(confirmedLocation)
        })
    }
  })
})

app.get('/summary', (req, res) => {
  res.send(summary)
})

app.get('/totalinfected', (req, res) => {
  res.send(totalConfirmed.toString())
})

app.get('/totaldeaths', (req, res) => {
  res.send(totalDeaths.toString())
})

app.get('/totalrecovered', (req, res) => {
  res.send(totalRecovered.toString())
})

app.get('/totalinfectedcountries', (req, res) => {
  res.send(totalConfirmedCountries.toString())
})

app.get('/confirmedlocations', (req, res) => {
  res.send(confirmedLocations)
})

module.exports = {
  path: '/api',
  handler: app
}
