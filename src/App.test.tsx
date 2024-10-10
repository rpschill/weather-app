import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as utils from './utils';
import fetch from 'jest-fetch-mock';  // To mock fetch API
import '@testing-library/jest-dom';  // for better assertions

jest.mock('./components/LineGraph', () => () => <div data-testid="line-graph" />);
jest.mock('./utils', () => ({
  celsiusToFahrenheit: jest.fn(),
  getWeatherConditions: jest.fn(),
  getDayOfWeek: jest.fn(),
  getCompasDirection: jest.fn(),
  getUvHealthConcernText: jest.fn(),
}));

beforeEach(() => {
  fetch.resetMocks();
});

describe('App component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Weather details/i)).toBeInTheDocument();
  });

  it('should call getLocation on initial render', async () => {
    // Mock the geolocation API
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        Promise.resolve(success({
          coords: { latitude: 51.1, longitude: 45.3 }
        }))
      )
    };

    render(<App />);

    // Wait for async location fetch
    await waitFor(() => expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled());
  });

  it('should fetch current weather when user location is available', async () => {
    // Mock location
    const mockLocation = { latitude: 51.1, longitude: 45.3 };

    // Mock geolocation
    global.navigator.geolocation.getCurrentPosition = jest.fn().mockImplementationOnce((success) => {
      success({ coords: mockLocation })
    })

    // Mock fetch
    fetch.mockResponseOnce(JSON.stringify({
      data: {
        values: {
          temperature: 20,
          weatherCode: 'clear',
          temperatureApparent: 18,
          windDirection: 120,
          windSpeed: 5,
          humidity: 60,
          uvIndex: 2,
          visibility: 10,
          pressureSurfaceLevel: 1000,
        }
      }
    }));

    // Mock forecast fetch
    fetch.mockResponseOnce(JSON.stringify({
      timelines: {
        daily: [{ values: { temperatureMax: 25, temperatureMin: 15 } }]
      }
    }));

    render(<App />);

    // Ensure fetch was called for weather and forecast data
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Verify data rendering from current weather
    expect(screen.getByText(/60%/i)).toBeInTheDocument(); // Humidity
    expect(screen.getByText(/5 mi\/h/i)).toBeInTheDocument(); // Wind speed
    expect(screen.getByText(/1000 hPa/i)).toBeInTheDocument(); // Pressure
  });

  it('should render line graph when forecast is available', async () => {
    const mockLocation = { latitude: 51.1, longitude: 45.3 };

    global.navigator.geolocation.getCurrentPosition = jest.fn().mockImplementationOnce((success) => {
      success({ coords: mockLocation })
    })

    fetch.mockResponseOnce(JSON.stringify({
      timelines: {
        daily: [{ values: { temperatureMax: 25, temperatureMin: 15 } }]
      }
    }));

    render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByTestId('line-graph')).toBeInTheDocument();
  });

  it('should call utility functions with correct parameters', async () => {
    const mockLocation = { latitude: 51.1, longitude: 45.3 };

    global.navigator.geolocation.getCurrentPosition = jest.fn().mockImplementationOnce((success) => {
      success({ coords: mockLocation })
    });

    fetch.mockResponseOnce(JSON.stringify({
      data: { values: { temperature: 20, weatherCode: 'clear' } }
    }));

    render(<App />);

    await waitFor(() => expect(utils.celsiusToFahrenheit).toHaveBeenCalledWith(20));
    await waitFor(() => expect(utils.getWeatherConditions).toHaveBeenCalledWith('clear'));
  });
});
