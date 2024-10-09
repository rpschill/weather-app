export const getWeatherConditions = (weatherCode: number) => {
  switch (weatherCode) {
    case 0:
      return 'Unknown';
    case 1000:
      return 'Clear, Sunny';
    case 1100:
      return "Mostly Clear";
    case 1101:
      return 'Partly Cloudy';
    case 1102:
      return 'Mostly Cloudy';
    case 1001:
      return 'Cloudy';
    case 2000:
      return 'Fog';
    case 2100:
      return 'Light Fog';
    case 4000:
      return 'Drizzle';
    case 4001:
      return 'Rain';
    case 4200:
      return 'Light Rain';
    case 4201:
      return 'Heavy Rain';
    case 5000:
      return 'Snow';
    case 5001:
      return 'Flurries';
    case 5100:
      return 'Light Snow';
    case 5101:
      return 'Heavy Snow';
    case 6000:
      return 'Freezing Drizzle';
    case 6001:
      return 'Freezing Rain';
    case 6200:
      return 'Light Freezing Rain';
    case 6201:
      return 'Heavy Freezing Rain';
    case 7000:
      return 'Ice Pellets';
    case 7101:
      return 'Heavy Ice Pellets';
    case 7102:
      return 'Light Ice Pellets';
    case 8000:
      return 'Thunderstorm';
    default:
      return 'Unknown';
  }
}

export const getDayOfWeek = (date: string): string => {
  const dayIndex = new Date(date).getDay();

  switch (dayIndex) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    default:
      return '';
  }
}

export const celsiusToFahrenheit = (celcius: number): number => {
  const fahrenheit = (celcius * 9/5) + 32;
  return Math.floor(fahrenheit);
}

export const getCompasDirection = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  degrees = (degrees % 360 + 360) % 360;
  const index = Math.round(degrees / 22.5) % 16;

  return directions[index];
}

export const getUvHealthConcernText = (value: number): string => {
  switch (value) {
    case 0:
    case 1:
    case 2:
      return 'Low';
    case 3:
    case 4:
    case 5:
      return 'Moderate';
    case 6:
    case 7:
      return 'High';
    case 8:
    case 9:
    case 10:
      return 'Very high';
    case 11:
      return 'Extreme';
    default:
      return 'Low';
  }
}