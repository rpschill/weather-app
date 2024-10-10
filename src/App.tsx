"use client"

import { useEffect, useState } from 'react'
import './App.css'
import { getWeatherConditions, getDayOfWeek, getCompasDirection, celsiusToFahrenheit, getUvHealthConcernText } from './utils';
import LineGraph from './components/LineGraph';
import InfoBanner from './components/InfoBanner';
import WeatherDetails from './components/WeatherDetails';

interface Location {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [userLocationName, setUserLocationName] = useState<string | null>(null);
  const [current, setCurrent] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);


  const weatherBaseUrl = 'https://api.tomorrow.io/v4/weather/';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  }

  const key = process.env.REACT_APP_WEATHER_API_KEY;
  const mapsKey = process.env.REACT_APP_MAPS_API_KEY;

  useEffect(() => {
    getUserData();
  },[]);

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('position', position);
          const { latitude, longitude } = position.coords;

          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  const getLocationName = async () => {
    if (!userLocation) {
      console.error('No location found.');
    }

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation?.latitude},${userLocation?.longitude}&key=${mapsKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        response.json()
          .then(data => {
            const name = data.results[0].address_components[2].long_name;

            setUserLocationName(name);
          });
      })
  }

  const getCurrentWeather = async () => {
    if (!userLocation) {
      console.error('No location found.');
    }

    fetch(`${weatherBaseUrl}/realtime?location=${userLocation?.latitude},${userLocation?.longitude}&apikey=${key}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        response.json()
          .then((data) => {
            setCurrent(data);
          })
        
        return response;
      })
  }
  
  const getWeatherForecast = async () => {
    if (!userLocation) {
      console.error('No location found.');
    }

    fetch(`${weatherBaseUrl}/forecast?location=${userLocation?.latitude},${userLocation?.longitude}&apikey=${key}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        response.json()
          .then((data) => {
            setForecast(data);
          })

        return response;
      })
  }

  const getUserData = async () => {
    await getLocation()
      .then(() => {
        getLocationName();
        getCurrentWeather();
        getWeatherForecast();
      })
  }

  return (
    <div className="backdrop-grayscale h-dvh">
      {userLocation && current && forecast && (
        <div className="flex flex-col">
          <InfoBanner userLocationName={userLocationName} current={current} forecast={forecast} />

          <div className="flex flex-row mt-12 mx-16">
            <p className="basis-1/2 text-white text-3xl font-bold text-left">Weather details</p>
            <p className="basis-1/2 text-white text-3xl font-bold text-left pl-6">5-day weather forecast</p>
          </div>

          <div className="flex flex-row items-stretch mx-16 gap-x-10">
            {current && (
              <WeatherDetails current={current} />
            )}


            {forecast && (
              <div className="basis-1/2 mt-6 border-2 border-gray-500 rounded-lg flex flex-col bg-black opacity-75">
                <LineGraph forecastData={forecast} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
