"use client"

import { celsiusToFahrenheit, getWeatherConditions, getDayOfWeek, getUvHealthConcernText } from "../utils";



const InfoBanner = (props: any) => {

  return (
    <div className="mx-16 rounded-medium mt-6 border-2 border-gray-500 shadow shadow-white rounded-lg bg-black opacity-75">
      <div className="flex container mx-auto px-4 h-48">
        {props.current && (
          <div className="flex flex-col my-8 mx-8 items-start w-full">
            <p className="font-sans font-semibold text-white text-3xl">{props.userLocationName}</p>
            <div className="flex flex-row mt-6 items-end w-full">
              <p className="text-yellow-600/100 font-bold tracking-tighter text-6xl">{celsiusToFahrenheit(props.current?.data.values.temperature)}°</p>
              <p className="text-white font-bold text-lg ml-2">{getWeatherConditions(props.current?.data.values.weatherCode)}</p>

              {props.forecast && (
                <div className="flex flex-col items-end grow">
                  <div className="flex flex-row gap-2.5">
                    <p className="text-white font-bold tracking-tighter text-lg">{getDayOfWeek(props.current?.data.time)}</p>
                    <p className="text-white font-bold tracking-tighter text-lg">{celsiusToFahrenheit(props.forecast?.timelines.daily[0].values.temperatureMax)}°</p>
                    <p className="text-white font-bold tracking-tighter text-lg">{celsiusToFahrenheit(props.forecast?.timelines.daily[0].values.temperatureMin)}°</p>
                  </div>
                  <p className="text-white font-bold tracking-tighter text-lg">UV health concern: {props.current?.data.values.uvHealthConcern} - {getUvHealthConcernText(props.current?.data.values.uvHealthConcern)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default InfoBanner;