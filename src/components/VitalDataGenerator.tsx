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
}

const VitalDataGenerator: React.FC<VitalDataGeneratorProps> = ({ vitalData }) => {
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