import {useState, useEffect} from 'react'
import axios from 'axios'
import ShowData from './components/ShowData'
import SetData from './components/SetData'
import ShowCountriesName from './components/ShowCountriesName'

const api_key = process.env.REACT_APP_API_KEY

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [searchCountries, setSearchCountries] = useState('')
  const [weather, setWeather] = useState([])
  const [show, setShow] = useState([false, false, false, false, false, false, false, false, false, false])
  
  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/countries')
      .then(response => {
        console.log('promise fufilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, [])
  
  const len = countries.length
  const lang = (obj) => {
    const arr = Object.values(obj.languages)
    return arr.map((item, key) => <li key={key}>{item}</li>)
  }
  const filterCountries = countries.filter((item) => {
      if (searchCountries.toLowerCase() === '') return item.name.common
      else {
        return item.name.common.toLowerCase().includes(searchCountries.toLowerCase())
      } 
    })
  
  const handleSearchCountries = (event) => {
    setSearchCountries(event.target.value)
  }

  const getWeather = () => {
      if (filterCountries.length !== 0 ) {
        const coor = filterCountries.map((item) => item.capitalInfo.latlng).filter((item, key) => {
        return (item != undefined && key === 0)
          }).filter(item => item)
        console.log(coor)
        const arr = [...coor]
        console.log(arr)
        const [lat, long] = [...arr[0]]
        console.log(lat, long)
          axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}`)
          .then(response => {
            console.log('api data collected')
            setWeather(response.data)
        })
      }
    }
  useEffect(getWeather, [filterCountries.length < 2])
  
  const dataOne = () => {
      return (
        filterCountries.map((item) => {
          return (
            <div key={item.name.common}>
              <h2>{item.name.common}</h2>
              <p>capital : {item.capital}</p>
              <p>area : {item.area}</p>
              <p><strong>Languages :</strong></p>
              <ul>
                {lang(item)}
              </ul>
              <img alt="countries flag" src={item.flags.png} />
            <div key={item.name.common}>
              <h2>Wearther in {item.capital}</h2>
              <p>tempetature : {toCelcius(weather.main.temp)} Celcius</p>
              <img alt="weather icon" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
              <p>wind : {weather.wind.speed} m/s</p>
              {console.log(weather)}
            </div>
            </div>
          )
        })
      )
    }

  
  
  const toCelcius = (temp) => {
    const result = temp - 273.15
    return Math.round((result + Number.EPSILON) * 100) / 100
  } 
  
  const handleClick = (key) => {
    const buttons = filterCountries.map(() => false)
    const result = buttons
    if (show[key] === true) result[key] = false
    else if (show[key] === false) result[key] = true
    setShow(result)
    }
  
  const buttonText = (index) => show[index] === true ? "hide" : "show"
  const countriesToShow = () => filterCountries.map((item, key) => {
      return ( 
        <div key={item.name.common}>
          {!show[key] && item.name.common} <button id={key} onClick={() => handleClick(key)}>{buttonText(key)}</button>
          {show[key] && <SetData obj={item} lang={lang} />} 
        </div>
      )
  })

  
  
  console.log('render', len, 'countries')
  console.log(weather)

  if (filterCountries.length > 10 && filterCountries.length < 250) {
    return (
      <div>
        find a countries : <input value={searchCountries} onChange={handleSearchCountries} />
        <p>Too many matches, specify your research</p>
      </div>
    )
  } else if  (filterCountries.length < 10) { 
    if (filterCountries.length === 1) {
      return (
        <div>
          find a countries : <input value={searchCountries} onChange={handleSearchCountries} />
          <ShowData data={dataOne()} />
        </div>
      )
    } else {
      return (
        <div>
          find a countries : <input value={searchCountries} onChange={handleSearchCountries} />
          <ShowCountriesName countriesName={countriesToShow()} />
        </div>
      )
    }
  } else { 
    return (
      <div>
        find a countries : <input value={searchCountries} onChange={handleSearchCountries} />
      </div>
    )
  }
}

export default App;
