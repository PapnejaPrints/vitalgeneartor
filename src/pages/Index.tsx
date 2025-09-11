"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format, addDays } from "date-fns";
import { MadeWithDyad } from "@/components/made-with-dyad";
import VitalDataGenerator from "@/components/VitalDataGenerator";
import VitalCharts from "@/components/VitalCharts";
import VitalSignFilter from "@/components/VitalSignFilter";
import ConditionSelector from "@/components/ConditionSelector";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, convertFahrenheitToCelsius } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Attribution } from "@/components/Attribution"; // Import the new Attribution component

interface DailyVitals {
  date: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  spo2: number;
  glucose: number;
  temperature: number;
}

type DataRange = 'weekly' | 'monthly' | 'yearly';

const Index = () => {
  const [vitalData, setVitalData] = useState<DailyVitals[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [selectedVitals, setSelectedVitals] = useState<string[]>([
    "heartRate",
    "spo2",
    "glucose",
    "temperature",
    "bloodPressure",
  ]);
  const [temperatureUnit, setTemperatureUnit] = useState<'fahrenheit' | 'celsius'>('fahrenheit');
  const [dataRange, setDataRange] = useState<DataRange>('weekly');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const generateFakeVitals = useCallback((start: Date = new Date(), range: DataRange = 'weekly', conditions: string[] = []): DailyVitals[] => {
    const data: DailyVitals[] = [];
    const currentStartDate = start;
    let numberOfDays = 7;

    if (range === 'monthly') {
      numberOfDays = 30;
    } else if (range === 'yearly') {
      numberOfDays = 365;
    }

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(currentStartDate, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");

      // Base ranges for healthy individuals
      let systolicMin = 90, systolicMax = 140;
      let diastolicMin = 60, diastolicMax = 90;
      let heartRateMin = 60, heartRateMax = 100;
      let spo2Min = 95, spo2Max = 100;
      let glucoseMin = 70, glucoseMax = 140;
      let temperatureMin = 97.0, temperatureMax = 99.0;

      // Adjust ranges based on selected conditions
      if (conditions.includes("diabetes")) {
        glucoseMin = 120;
        glucoseMax = 250;
      }
      if (conditions.includes("heartDisease")) {
        heartRateMin = 70;
        heartRateMax = 110;
        // Can also slightly affect BP, but hypertension will override
      }
      if (conditions.includes("hypertension")) {
        systolicMin = 130;
        systolicMax = 180;
        diastolicMin = 80;
        diastolicMax = 110;
      }
      if (conditions.includes("hypothyroidism")) {
        heartRateMin = 50;
        heartRateMax = 80;
        temperatureMin = 96.0;
        temperatureMax = 98.0;
      }
      if (conditions.includes("fever")) {
        temperatureMin = 99.5;
        temperatureMax = 103.0;
        heartRateMin = Math.max(heartRateMin, 80); // Ensure heart rate is at least 80
        heartRateMax = Math.max(heartRateMax, 120); // Ensure heart rate is at least 120
      }

      const systolic = Math.floor(Math.random() * (systolicMax - systolicMin + 1)) + systolicMin;
      const diastolic = Math.floor(Math.random() * (diastolicMax - diastolicMin + 1)) + diastolicMin;
      const heartRate = Math.floor(Math.random() * (heartRateMax - heartRateMin + 1)) + heartRateMin;
      const spo2 = Math.floor(Math.random() * (spo2Max - spo2Min + 1)) + spo2Min;
      const glucose = Math.floor(Math.random() * (glucoseMax - glucoseMin + 1)) + glucoseMin;
      const temperature = parseFloat((Math.random() * (temperatureMax - temperatureMin) + temperatureMin).toFixed(1));

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
  }, []);

  useEffect(() => {
    if (startDate) {
      setVitalData(generateFakeVitals(startDate, dataRange, selectedConditions));
    }
  }, [generateFakeVitals, startDate, dataRange, selectedConditions]);

  const handleRefreshData = () => {
    if (startDate) {
      setVitalData(generateFakeVitals(startDate, dataRange, selectedConditions));
    }
  };

  const handleVitalChange = (vital: string, isChecked: boolean) => {
    setSelectedVitals((prev) =>
      isChecked ? [...prev, vital] : prev.filter((v) => v !== vital)
    );
  };

  const handleConditionChange = (condition: string, isChecked: boolean) => {
    setSelectedConditions((prev) =>
      isChecked ? [...prev, condition] : prev.filter((c) => c !== condition)
    );
  };

  const handleTemperatureUnitChange = (checked: boolean) => {
    setTemperatureUnit(checked ? 'celsius' : 'fahrenheit');
  };

  const exportToCsv = () => {
    if (vitalData.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = [
      "Date",
      "Blood Pressure (Systolic)",
      "Blood Pressure (Diastolic)",
      "Heart Rate (bpm)",
      "SpO2 (%)",
      "Glucose (mg/dL)",
      `Temperature (${temperatureUnit === 'celsius' ? '°C' : '°F'})`,
    ];

    const csvRows = [
      headers.join(','),
      ...vitalData.map(day => {
        const temperatureValue = temperatureUnit === 'celsius'
          ? convertFahrenheitToCelsius(day.temperature).toFixed(1)
          : day.temperature.toFixed(1);

        return [
          day.date,
          day.bloodPressure.systolic,
          day.bloodPressure.diastolic,
          day.heartRate,
          day.spo2,
          day.glucose,
          temperatureValue,
        ].join(',');
      }),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `vital_data_${dataRange}_${format(startDate || new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 relative">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <Label htmlFor="temp-unit-toggle">°F</Label>
          <Switch
            id="temp-unit-toggle"
            checked={temperatureUnit === 'celsius'}
            onCheckedChange={handleTemperatureUnitChange}
          />
          <Label htmlFor="temp-unit-toggle">°C</Label>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-8">
        Vital Data Overview
      </h1>
      <Attribution /> {/* Render the new Attribution component near the top */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={dataRange} onValueChange={(value: DataRange) => setDataRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleRefreshData} className="px-6 py-3 text-lg">
          Refresh Data
        </Button>
        <Button onClick={exportToCsv} className="px-6 py-3 text-lg">
          Export CSV
        </Button>
      </div>
      <ConditionSelector
        selectedConditions={selectedConditions}
        onConditionChange={handleConditionChange}
      />
      <VitalSignFilter
        selectedVitals={selectedVitals}
        onVitalChange={handleVitalChange}
      />
      <VitalDataGenerator vitalData={vitalData} temperatureUnit={temperatureUnit} selectedVitals={selectedVitals} />
      <VitalCharts vitalData={vitalData} selectedVitals={selectedVitals} temperatureUnit={temperatureUnit} />
      <MadeWithDyad />
    </div>
  );
};

export default Index;