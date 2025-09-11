"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import medicalConditionsData from "@/data/medical_conditions_vital_ranges.json";
import { RawMedicalConditionsJson } from "@/types/medical"; // Import the raw type

interface ConditionSelectorProps {
  selectedCondition: string | undefined;
  onConditionChange: (conditionId: string | undefined) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedCondition,
  onConditionChange,
}) => {
  const data: RawMedicalConditionsJson = medicalConditionsData;

  // Sort categories alphabetically
  const sortedCategories = Object.keys(data).sort();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Select Health Condition
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Select
          value={selectedCondition}
          onValueChange={(value) => onConditionChange(value === "none" ? undefined : value)}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Specific Condition</SelectItem>
            {sortedCategories.map((categoryName) => (
              <SelectGroup key={categoryName}>
                <SelectLabel>{categoryName}</SelectLabel>
                {/* Sort conditions within each category alphabetically */}
                {Object.keys(data[categoryName]).sort().map((conditionName) => (
                  <SelectItem
                    key={`${categoryName}|${conditionName}`}
                    value={`${categoryName}|${conditionName}`}
                    className="pl-6"
                  >
                    {conditionName}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ConditionSelector;