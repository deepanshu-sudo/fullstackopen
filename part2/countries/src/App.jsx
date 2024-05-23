import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [error, setError] = useState(null)
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  const extractNames = (data) => {
    return data.map(country => ({
      common: country.name.common,
      official: country.name.official
    }));
  }

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        const names = extractNames(response.data)
        setCountries(names)
      })
      .catch(err => setError('Failed to fetch country data'))
  }, [])

  useEffect(() => {
    const filtered = countries.filter(name =>
      name.common.toLowerCase().includes(value.toLowerCase()) ||
      name.official.toLowerCase().includes(value.toLowerCase())
    )
    if (filtered.length > 10) {
      setError('too many matches, specify another filter')
      setCountry(null)
    } else if (filtered.length === 0) {
      setError('no matches')
      setCountry(null)
    } else if (filtered.length === 1) {
      showCountryView(filtered[0].common)
    } else {
      setFilteredCountries(filtered)
      setError(null)
      setCountry(null)
    }

  }, [value, countries])

  useEffect(() => {
    if (country && country.capital && country.capital[0]) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`)
        .then(response => setWeather(response.data))
        .catch(err => setWeather(null))
    } else {
      setWeather(null);
    }
  }, [country, api_key])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
  }

  const showCountryView = (name) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry(response.data)
        setError(null)
      })
      .catch((err) => setError('Failed to fetch country details'));
  }

  const displayData = () => {
    if (error) {
      return <p>{error}</p>
    } else if (country) {
      const { name, capital, area, flags, languages } = country;
      return (
        <div>
          <h2>{name.common} ({name.official})</h2>
          {capital && <p>Capital: {capital.join(', ')}</p>}
          {area && <p>Area: {area} sq. km</p>}
          {flags && <img src={flags.png} alt={`Flag of ${name.common}`} width="100" />}
          {languages &&
            <div>
              <h3>Languages:</h3>
              <ul>
                {Object.values(languages).map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </div>}
          {weather ? (
            <div>
              <h2>Weather in {weather.name}</h2>
              <p>temperature: {weather.main.temp} °C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={`weather in ${weather.name}`}
              />
              <p>wind speed: {weather.wind.speed} m/s</p>
            </div>
          ) : (
            <p>No weather data available</p>
          )}
        </div>
      )
    } else {
      return filteredCountries.map((country, index) => (
        <p key={index}>{country.common} ({country.official}) <button onClick={() => showCountryView(country.common)}>show</button></p>
      ))
    }
  }

  return (
    <>
      <form onSubmit={onSearch}>
        find countries: <input type="text" onChange={handleChange} />
      </form>
      <div>
        {displayData()}
      </div>
    </>
  )
}

export default App