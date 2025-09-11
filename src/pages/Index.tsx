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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DailyVitals {
  date: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  spo2: number;
  glucose: number;
  temperature: number;
}

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

  const generateFakeVitals = useCallback((start: Date = new Date()): DailyVitals[] => {
    const data: DailyVitals[] = [];
    const currentStartDate = start;

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(currentStartDate, i);
      const formattedDate = format(currentDate, "PPP");

      const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90;
      const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
      const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
      const spo2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
      const glucose = Math.floor(Math.random() * (140 - 70 + 1)) + 70;
      const temperature = parseFloat((Math.random() * (99.0 - 97.0) + 97.0).toFixed(1)); // Always generate in Fahrenheit

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
      setVitalData(generateFakeVitals(startDate));
    }
  }, [generateFakeVitals, startDate]);

  const handleRefreshData = () => {
    if (startDate) {
      setVitalData(generateFakeVitals(startDate));
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
        Weekly Vital Data Overview
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
        <Button onClick={handleRefreshData} className="px-6 py-3 text-lg">
          Refresh Data
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