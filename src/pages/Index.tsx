import React, { useState, useEffect, useCallback } from "react";
import { format, addDays } from "date-fns";
import { MadeWithDyad } from "@/components/made-with-dyad";
import VitalDataGenerator from "@/components/VitalDataGenerator";
import VitalCharts from "@/components/VitalCharts";
import { Button } from "@/components/ui/button"; // Import the Button component

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

  const generateFakeVitals = useCallback((): DailyVitals[] => {
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
  }, []);

  useEffect(() => {
    setVitalData(generateFakeVitals());
  }, [generateFakeVitals]);

  const handleRefreshData = () => {
    setVitalData(generateFakeVitals());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Weekly Vital Data Overview
      </h1>
      <Button onClick={handleRefreshData} className="mb-8 px-6 py-3 text-lg">
        Refresh Data
      </Button>
      <VitalDataGenerator vitalData={vitalData} />
      <VitalCharts vitalData={vitalData} />
      <MadeWithDyad />
    </div>
  );
};

export default Index;