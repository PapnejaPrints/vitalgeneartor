import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface VitalDataGeneratorProps {
  vitalData: DailyVitals[];
  temperatureUnit: 'fahrenheit' | 'celsius';
  selectedVitals: string[];
}

const vitalOptions = [
  { id: "bloodPressure", label: "Blood Pressure" },
  { id: "heartRate", label: "Heart Rate" },
  { id: "spo2", label: "SpO2" },
  { id: "glucose", label: "Glucose" },
  { id: "temperature", label: "Temperature" },
];

const VitalDataGenerator: React.FC<VitalDataGeneratorProps> = ({ vitalData, temperatureUnit, selectedVitals }) => {
  const getDisplayTemperature = (tempFahrenheit: number) => {
    if (temperatureUnit === 'celsius') {
      return `${convertFahrenheitToCelsius(tempFahrenheit).toFixed(1)}°C`;
    }
    return `${tempFahrenheit}°F`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Weekly Vital Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        {vitalData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                {vitalOptions.map((option) =>
                  selectedVitals.includes(option.id) && (
                    <TableHead key={option.id}>
                      {option.label}
                      {option.id === "temperature" && ` (${temperatureUnit === 'celsius' ? '°C' : '°F'})`}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{day.date}</TableCell>
                  {selectedVitals.includes("bloodPressure") && (
                    <TableCell>{day.bloodPressure.systolic}/{day.bloodPressure.diastolic} mmHg</TableCell>
                  )}
                  {selectedVitals.includes("heartRate") && (
                    <TableCell>{day.heartRate} bpm</TableCell>
                  )}
                  {selectedVitals.includes("spo2") && (
                    <TableCell>{day.spo2}%</TableCell>
                  )}
                  {selectedVitals.includes("glucose") && (
                    <TableCell>{day.glucose} mg/dL</TableCell>
                  )}
                  {selectedVitals.includes("temperature") && (
                    <TableCell>{getDisplayTemperature(day.temperature)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">Generating vital data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalDataGenerator;