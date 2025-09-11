import React, { useState, useEffect, useCallback } from "react";
import { format, addDays } from "date-fns";
import { MadeWithDyad } from "@/components/made-with-dyad";
import VitalDataGenerator from "@/components/VitalDataGenerator";
import VitalCharts from "@/components/VitalCharts";
import VitalSignFilter from "@/components/VitalSignFilter";
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

  const generateFakeVitals = useCallback((start: Date = new Date(), range: DataRange = 'weekly'): DailyVitals[] => {
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

      const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90;
      const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
      const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
      const spo2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
      const glucose = Math.floor(Math.random() * (140 - 70 + 1)) + 70;
      const temperature = parseFloat((Math.random() * (99.0 - 97.0) + 97.0).toFixed(1));

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
      setVitalData(generateFakeVitals(startDate, dataRange));
    }
  }, [generateFakeVitals, startDate, dataRange]);

  const handleRefreshData = () => {
    if (startDate) {
      setVitalData(generateFakeVitals(startDate, dataRange));
    }
  };

  const handleVitalChange = (vital: string, isChecked: boolean) => {
    setSelectedVitals((prev) =>
      isChecked ? [...prev, vital] : prev.filter((v) => v !== vital)
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