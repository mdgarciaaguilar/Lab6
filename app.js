
const express = require('express')
const weather = require('./weather.js')

const app = express()

const port = process.env.PORT || 3000

app.get('/', function(req, res) {
  res.send({
    greeting: 'Hola Mundo!'
  })
})





app.get('/weather', function(req, res) {

  //return res.send(req.query.search)
  if ( !req.query.search ) {
    res.send({
      error: 'Debes enviar el nombre de un lugar'
    })
  } else {
    weather.obtenerLatitud(req.query.search, function(error, response) {
      if (error) {
        return res.send({
          error: error
        })
      }
      let longitud = response.features[0].center[0]
      let latitud = response.features[0].center[1]

      weather.obtenerClima(latitud, longitud, function(error, response) {
        if (error) {
          return res.send({
            error: error
          })
        } else {
            const data = response.body
            const info = {
              summary: data.currently.summary,
              temperature: data.currently.temperature,
              precipProbability: data.currently.precipProbability,
              precipType: data.currently.precipType,
              humidity: data.currently.humidity,
              alerts: data.alerts
            }

            let resultado = info.summary + ' durante el dia. Actualmente esta a ' + info.temperature +
            ' C. Hay una ' + info.precipProbability + ' % de posibilidad de precipitacion de tipo ' + info.precipType +
            '\n Hay una humedad de ' + info.humidity
            return res.send(resultado)

          }
      })

    })
  }



  })





app.get('*', function(req, res) {
  res.send({
    error: 'Ruta no valida'
  })
})


app.listen(port, function() {
  console.log('Up and running!')
})
