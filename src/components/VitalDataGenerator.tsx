import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyVitals {
  date: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  spo2: number;
  glucose: number;
  temperature: number;
}

const VitalDataGenerator: React.FC = () => {
  const [vitalData, setVitalData] = useState<DailyVitals[]>([]);

  useEffect(() => {
    const generateFakeVitals = (): DailyVitals[] => {
      const data: DailyVitals[] = [];
      const startDate = new Date(); // Start from today

      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(startDate, i);
        const formattedDate = format(currentDate, "PPP"); // e.g., Oct 27, 2023

        // Generate random values within realistic ranges
        const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90; // 90-140
        const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // 60-90
        const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60-100 bpm
        const spo2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95; // 95-100%
        const glucose = Math.floor(Math.random() * (140 - 70 + 1)) + 70; // 70-140 mg/dL
        const temperature = parseFloat((Math.random() * (99.0 - 97.0) + 97.0).toFixed(1)); // 97.0-99.0 °F

        data.push({
          date: formattedDate,
          bloodPressure: { systolic, diastolic },
          heartRate,
          spo2,
          glucose,
          temperature,
        });
      }
      return data;
    };

    setVitalData(generateFakeVitals());
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Weekly Vital Data</CardTitle>
      </CardHeader>
      <CardContent>
        {vitalData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>SpO2</TableHead>
                <TableHead>Glucose</TableHead>
                <TableHead>Temperature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{day.date}</TableCell>
                  <TableCell>{day.bloodPressure.systolic}/{day.bloodPressure.diastolic} mmHg</TableCell>
                  <TableCell>{day.heartRate} bpm</TableCell>
                  <TableCell>{day.spo2}%</TableCell>
                  <TableCell>{day.glucose} mg/dL</TableCell>
                  <TableCell>{day.temperature}°F</TableCell>
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