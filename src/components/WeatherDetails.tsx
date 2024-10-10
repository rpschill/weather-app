"use client"

import { celsiusToFahrenheit, getCompasDirection } from "../utils"

const WeatherDetails = ({current}: any) => {

  return (
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
  )
}
export default WeatherDetails;