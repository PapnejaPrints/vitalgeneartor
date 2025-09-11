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
import { MedicalConditionsData } from "@/types/medical";

interface ConditionSelectorProps {
  selectedCondition: string | undefined;
  onConditionChange: (conditionId: string | undefined) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedCondition,
  onConditionChange,
}) => {
  const data: MedicalConditionsData = medicalConditionsData;

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
            {data.map((categoryData) => (
              <SelectGroup key={categoryData.category}>
                <SelectLabel>{categoryData.category}</SelectLabel>
                {categoryData.conditions.map((condition) => (
                  <React.Fragment key={condition.id}>
                    <SelectItem value={condition.id} className="pl-6">
                      {condition.label}
                    </SelectItem>
                    {condition.subConditions &&
                      condition.subConditions.map((subCondition) => (
                        <SelectItem
                          key={subCondition.id}
                          value={subCondition.id}
                          className="pl-10"
                        >
                          {subCondition.label}
                        </SelectItem>
                      ))}
                  </React.Fragment>
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