import { useState, useEffect } from "react";
import "./App.css";
import "./queries.css";

function App() {
  const [currentHour, setCurrentHour] = useState("");
  const [currentMinute, setCurrentMinute] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");

  const [weatherData, setWeatherData] = useState({});

  const [weatherIcon, setWeatherIcon] = useState("");

  const [airData, setAirData] = useState({});
  const [airQuality, setAirQuality] = useState("");

  const [userSearch, setUserSearch] = useState("");

  const handleSearch = function (e) {
    setUserSearch(e.target.value);
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    if (userSearch !== "") {
      try {
        fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=1&appid=d64ce91bca2b8bd1d81cc2bebf950447`
        )
          .then((res) => res.json())
          .then(([geoData]) => {
            setCity(geoData.name);
            setLatitude(geoData.lat.toFixed(2));
            setLongitude(geoData.lon.toFixed(2));
          })
          .catch((err) => {
            alert(
              "Oops! couldn't find this location! Try searching for a different location."
            );
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (currentHour !== "" && currentHour >= 19) {
      setWeatherIcon("ClearNightV3.svg");
    } else if (currentHour !== "" && currentHour < 19) {
      setWeatherIcon("SunnyDayV3.svg");
    }
  }, [currentHour]);

  useEffect(() => {
    const currentDate = new Date();
    setCurrentHour(currentDate.getHours());
    setCurrentMinute(currentDate.getMinutes());
  }, []);

  useEffect(() => {
    try {
      const fetchLocation = async function () {
        const res = await fetch("https://ipapi.co/json/");
        const locationData = await res.json();
        const { latitude, longitude, city } = locationData;

        setLatitude(latitude.toFixed(2));
        setLongitude(longitude.toFixed(2));
        setCity(city);
      };

      fetchLocation().catch((err) => {
        alert("Oops! Something went wrong! Try again later!");
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    try {
      if (latitude !== "" && longitude !== "") {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d64ce91bca2b8bd1d81cc2bebf950447`
        )
          .then((res) => res.json())
          .then((data) => setWeatherData(data))
          .catch((err) => {
            alert("Oops! Something went wrong! Try again later!");
          });
      }
    } catch (err) {
      console.error(err);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude !== "" && longitude !== "") {
      try {
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=d64ce91bca2b8bd1d81cc2bebf950447`
        )
          .then((res) => res.json())
          .then((data) => {
            setAirData(data);

            const aqi = data.list[0].main.aqi;
            let airQ = "";

            if (aqi === 1) {
              airQ = "Good";
            } else if (aqi === 2) {
              airQ = "Fair";
            } else if (aqi === 3) {
              airQ = "Moderate";
            } else if (aqi === 4) {
              airQ = "Poor";
            } else if (aqi === 5) {
              airQ = "Very Poor";
            } else {
              airQ = "Unknown";
            }

            setAirQuality(airQ);
          })
          .catch((err) => {
            alert("Oops! Something went wrong! Try again later!");
          });
      } catch (err) {
        console.error(err);
      }
    }
  }, [latitude, longitude]);

  return (
    <>
      <header className="header">
        <h1 className="logo">Sky Cast &mdash;</h1>
      </header>

      <main>
        <div className="main-container">
          <div className="main-header">
            <div>
              <p className="current-weather">Current weather</p>
              <p className="time">
                {currentHour}:{currentMinute} {currentHour < 12 ? "AM" : "PM"}
              </p>
            </div>

            <div>
              <p className="location">{city}</p>
            </div>
          </div>

          <div className="main-info">
            {weatherIcon !== "" && (
              <img
                src={`https://assets.msn.com/weathermapdata/1/static/weather/Icons/taskbar_v8/Condition_Card/${weatherIcon}`}
                alt="Weather icon which shows the type of current weather"
              />
            )}

            <h1 className="degree">
              {weatherData.main && Math.trunc(weatherData.main.temp - 273.15)}
              &deg;C
            </h1>
            <div>
              <p className="weather-type">
                {weatherData.weather && weatherData.weather[0].main}
              </p>
              <p>
                Feels like{" "}
                {weatherData.main &&
                  Math.trunc(weatherData.main.feels_like - 273.15)}
                &deg;C
              </p>
            </div>
          </div>
          <p className="weather-description">
            There will be mostly{" "}
            {weatherData.weather && weatherData.weather[0].description}. The
            high will be{" "}
            {weatherData.main && Math.trunc(weatherData.main.temp_max - 273.15)}
            °.
          </p>

          <div className="weather-info">
            <div>
              <p className="info-title">Air quality</p>
              <p className="info-value">
                {airQuality} ({airData.list && airData.list[0].main.aqi})
              </p>
            </div>
            <div>
              <p className="info-title">Wind</p>
              <p className="info-value">
                {weatherData.wind && weatherData.wind.speed.toFixed(1)} km/h
              </p>
            </div>
            <div>
              <p className="info-title">Humidity</p>
              <p className="info-value">
                {weatherData.main && weatherData.main.humidity}%
              </p>
            </div>
            <div>
              <p className="info-title">Visibility</p>
              <p className="info-value">
                {weatherData.visibility && weatherData.visibility / 1000} km
              </p>
            </div>
            <div>
              <p className="info-title">Pressure</p>
              <p className="info-value">
                {weatherData.main && weatherData.main.pressure} mb
              </p>
            </div>
            <div>
              <p className="info-title">Ground Level</p>
              <p className="info-value">
                {weatherData.main && weatherData.main.grnd_level} hpa
              </p>
            </div>
          </div>
        </div>

        <form className="search-container" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            name="search"
            value={userSearch}
            onChange={handleSearch}
            placeholder="Search for a different location"
          ></input>
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
      </main>

      <footer className="footer">
        <p className="footer-info">Designed and built by Yash Kale.</p>
      </footer>
    </>
  );
}

export default App;
