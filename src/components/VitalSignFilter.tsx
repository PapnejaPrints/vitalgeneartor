import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalSignFilterProps {
  selectedVitals: string[];
  onVitalChange: (vital: string, isChecked: boolean) => void;
}

const vitalOptions = [
  { id: "heartRate", label: "Heart Rate" },
  { id: "spo2", label: "SpO2" },
  { id: "glucose", label: "Glucose" },
  { id: "temperature", label: "Temperature" },
  { id: "bloodPressure", label: "Blood Pressure" },
];

const VitalSignFilter: React.FC<VitalSignFilterProps> = ({
  selectedVitals,
  onVitalChange,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Filter Vital Signs</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {vitalOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedVitals.includes(option.id)}
              onCheckedChange={(checked) =>
                onVitalChange(option.id, checked as boolean)
              }
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VitalSignFilter;