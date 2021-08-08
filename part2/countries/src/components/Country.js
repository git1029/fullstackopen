import React from 'react'

const Weather = ({ weather, capital }) => {
  if (!weather) return null

  const temp = weather.current.temperature
  const windDir = weather.current.wind_dir
  const windSpeed = weather.current.wind_speed
  const weatherIcon = weather.current.weather_icons[0]
  const weatherDesc = weather.current.weather_descriptions[0]

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div><b>Temperature:</b> {temp} Celcius</div>
      <img 
        src={weatherIcon} 
        alt={weatherDesc} 
        width='64'
        height='64'
      />
      <div><b>Conditions:</b> {weatherDesc}</div>
      <div><b>Wind:</b> {windSpeed} direction {windDir} kph</div>
    </div>
  )
}

const Country = ({ country, weather }) => {
  if (!country) return null

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map(language =>
          <li key={language.iso639_2}>
            {language.name}
          </li>  
        )}
      </ul>
      <img 
        src={country.flag} 
        alt={`flag of ${country.name}`}
        width='150'
        height='auto'
      />
      <Weather 
        weather={weather}
        capital={country.capital} 
      />
    </div>
  )
}

export default Country