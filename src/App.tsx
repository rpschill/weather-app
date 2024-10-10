"use client"

import { useEffect, useState } from 'react'
import './App.css'
import { getWeatherConditions, getDayOfWeek, getCompasDirection, celsiusToFahrenheit, getUvHealthConcernText } from './utils';
import LineGraph from './components/LineGraph';

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
      {userLocation && (
        <div className="flex flex-col">
          <div className="mx-16 rounded-medium mt-6 border-2 border-gray-500 shadow shadow-white rounded-lg bg-black opacity-75">
            <div className="flex container mx-auto px-4 h-48">
              {current && (
                <div className="flex flex-col my-8 mx-8 items-start w-full">
                  <p className="font-sans font-semibold text-white text-3xl">{userLocationName}</p>
                  <div className="flex flex-row mt-6 items-end w-full">
                    <p className="text-yellow-600/100 font-bold tracking-tighter text-6xl">{celsiusToFahrenheit(current?.data.values.temperature)}°</p>
                    <p className="text-white font-bold text-lg ml-2">{getWeatherConditions(current?.data.values.weatherCode)}</p>

                    {forecast && (
                      <div className="flex flex-col items-end grow">
                        <div className="flex flex-row gap-2.5">
                          <p className="text-white font-bold tracking-tighter text-lg">{getDayOfWeek(current?.data.time)}</p>
                          <p className="text-white font-bold tracking-tighter text-lg">{celsiusToFahrenheit(forecast?.timelines.daily[0].values.temperatureMax)}°</p>
                          <p className="text-white font-bold tracking-tighter text-lg">{celsiusToFahrenheit(forecast?.timelines.daily[0].values.temperatureMin)}°</p>
                        </div>
                        <p className="text-white font-bold tracking-tighter text-lg">UV health concern: {current?.data.values.uvHealthConcern} - {getUvHealthConcernText(current?.data.values.uvHealthConcern)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row mt-12 mx-16">
            <p className="basis-1/2 text-white text-3xl font-bold text-left">Weather details</p>
            <p className="basis-1/2 text-white text-3xl font-bold text-left pl-6">5-day weather forecast</p>
          </div>

          <div className="flex flex-row items-stretch mx-16 gap-x-10">
            <div className="basis-1/2 mt-6 border-2 border-gray-500 rounded-lg flex flex-col">
              <div className="flex flex-row grow m-3 space-x-3">
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">Feels like</p>
                  <p className="text-white text-2xl">{celsiusToFahrenheit(current?.data.values.temperatureApparent)}°</p>
                </div>
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">{getCompasDirection(current?.data.values.windDirection)} wind</p>
                  <p className="text-white text-2xl">{current?.data.values.windSpeed.toFixed(1)} mi/h</p>
                </div>
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">Humidity</p>
                  <p className="text-white text-2xl">{current?.data.values.humidity}%</p>
                </div>
              </div>
              <div className="flex flex-row grow m-3 space-x-4">
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">UV</p>
                  <p className="text-white text-2xl">{current?.data.values.uvIndex}</p>
                </div>
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">Visibility</p>
                  <p className="text-white text-2xl">{current?.data.values.visibility} mi</p>
                </div>
                <div className="flex flex-col basis-1/3 gap-3 rounded-lg bg-black opacity-75 text-white my-auto min-h-24 justify-center">
                  <p className="text-gray-500 text-xl">Pressure</p>
                  <p className="text-white text-2xl">{current?.data.values.pressureSurfaceLevel.toFixed(0)} hPa</p>
                </div>
              </div>
            </div>
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
