"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConditionSelectorProps {
  selectedConditions: string[];
  onConditionChange: (condition: string, isChecked: boolean) => void;
}

const conditionOptions = [
  { id: "diabetes", label: "Diabetes (Type 1 or 2)" },
  { id: "heartDisease", label: "Heart Disease" },
  { id: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { id: "hypothyroidism", label: "Hypothyroidism" },
  { id: "fever", label: "Fever/Infection" },
];

const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedConditions,
  onConditionChange,
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Select Health Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {conditionOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedConditions.includes(option.id)}
              onCheckedChange={(checked) =>
                onConditionChange(option.id, checked as boolean)
              }
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConditionSelector;