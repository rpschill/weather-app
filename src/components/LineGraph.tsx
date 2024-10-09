import { Chart, registerables } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { getDayOfWeek, celsiusToFahrenheit } from '../utils';
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(...registerables);
Chart.register(ChartDataLabels);


const LineGraph = ({forecastData}: any) => {

  const days: string[] = [];
    const hiTemps: number[] = [];
    const lowTemps: number[] = [];

    forecastData?.timelines.daily.forEach((day: any) => {
      days.push(getDayOfWeek(day.time));
      hiTemps.push(celsiusToFahrenheit(day.values.temperatureMax));
      lowTemps.push(celsiusToFahrenheit(day.values.temperatureMin));
    });

    const data = {
      labels: days,
      datasets: [
        {
          label: "High Temps",
          data: hiTemps,
          fill: false,
          borderColor: 'yellow',
          pointBorderColor: '#FFFFFF',
          pointBackgroundColor: '#FFFFFF',
          backgroundColor: 'yellow',
          tension: 0.1
        },
        {
          label: 'Low Temps',
          data: lowTemps,
          fill: false,
          borderColor: 'blue',
          pointBorderColor: '#FFFFFF',
          pointBackgroundColor: '#FFFFFF',
          backgroundColor: 'blue',
          tension: 0.1
        }
      ]
      
    }

  return (
    <div>
      <Line data={data} />
    </div>
  )
}

export default LineGraph;