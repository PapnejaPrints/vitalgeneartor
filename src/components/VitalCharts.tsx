import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertFahrenheitToCelsius } from "@/lib/utils";

interface DailyVitals {
  date: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  spo2: number;
  glucose: number;
  temperature: number;
}

interface VitalChartsProps {
  vitalData: DailyVitals[];
  selectedVitals: string[];
  temperatureUnit: 'fahrenheit' | 'celsius';
}

const VitalCharts: React.FC<VitalChartsProps> = ({ vitalData, selectedVitals, temperatureUnit }) => {
  const getTemperatureChartData = () => {
    if (temperatureUnit === 'celsius') {
      return vitalData.map(day => ({
        ...day,
        temperature: parseFloat(convertFahrenheitToCelsius(day.temperature).toFixed(1)),
      }));
    }
    return vitalData;
  };

  const temperatureChartData = getTemperatureChartData();
  const temperatureUnitLabel = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {/* Heart Rate Chart */}
      {selectedVitals.includes("heartRate") && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Heart Rate (bpm)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key={`heartRate-chart-${vitalData.length}`}>
              <LineChart data={vitalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* SpO2 Chart */}
      {selectedVitals.includes("spo2") && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">SpO2 (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key={`spo2-chart-${vitalData.length}`}>
              <LineChart data={vitalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spo2" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Glucose Chart */}
      {selectedVitals.includes("glucose") && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Glucose (mg/dL)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key={`glucose-chart-${vitalData.length}`}>
              <LineChart data={vitalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="glucose" stroke="#ffc658" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Temperature Chart */}
      {selectedVitals.includes("temperature") && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Temperature ({temperatureUnitLabel})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key={`temperature-chart-${vitalData.length}-${temperatureUnit}`}>
              <LineChart data={temperatureChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ff7300" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Blood Pressure Chart (Systolic and Diastolic) */}
      {selectedVitals.includes("bloodPressure") && (
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Blood Pressure (mmHg)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key={`bloodPressure-chart-${vitalData.length}`}>
              <LineChart data={vitalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={(data) => data.bloodPressure.systolic} stroke="#f00" name="Systolic" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={(data) => data.bloodPressure.diastolic} stroke="#00f" name="Diastolic" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VitalCharts;