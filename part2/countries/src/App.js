import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Results from './components/Results'
import Country from './components/Country'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [results, setResults] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  // Get country data
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // Get weather data (should include promise error checking)
  useEffect(() => {
    if (country) {
      const capital = country.capital
      const api_key = process.env.REACT_APP_API_KEY
      const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
      axios
        .get(url)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [country])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)

    const results = countries
      .filter(country =>
        country.name.toUpperCase()
          .includes(event.target.value.toUpperCase())  
      )
    setResults(results)

    if (results.length === 1) setCountry(results[0])
    else {
      setCountry(null)
      setWeather(null)
    }
  }

  const handleShowClick = (country) => (
    () => {
      setFilter(country.name)
      setResults([country])
      setCountry(country)
    }
  )

  return (
    <div>
      <Filter 
        filter={filter}
        handleFilterChange={handleFilterChange} 
      />
      <Results
        filter={filter}
        results={results}
        handleShowClick={handleShowClick}
      />
      <Country 
        country={country}
        weather={weather}
      />
    </div>
  )
}

export default App
