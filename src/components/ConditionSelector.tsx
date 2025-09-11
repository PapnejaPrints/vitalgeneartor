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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import medicalConditionsData from "@/data/medical_conditions_vital_ranges.json";
import { RawMedicalConditionsJson } from "@/types/medical";

interface ConditionSelectorProps {
  selectedCondition: string | undefined;
  onConditionChange: (conditionId: string | undefined) => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedCondition,
  onConditionChange,
}) => {
  const data: RawMedicalConditionsJson = medicalConditionsData;
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
          <SelectContent className="p-0">
            <Command>
              <CommandInput placeholder="Search condition..." />
              <CommandList>
                <CommandEmpty>No condition found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="none"
                    onSelect={() => onConditionChange(undefined)}
                    className="cursor-pointer"
                  >
                    No Specific Condition
                  </CommandItem>
                </CommandGroup>
                {sortedCategories.map((categoryName) => (
                  <CommandGroup key={categoryName} heading={categoryName}>
                    {Object.keys(data[categoryName]).sort().map((conditionName) => (
                      <CommandItem
                        key={`${categoryName}|${conditionName}`}
                        value={`${categoryName}|${conditionName}`}
                        onSelect={() => onConditionChange(`${categoryName}|${conditionName}`)}
                        className="cursor-pointer pl-6"
                      >
                        {conditionName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ConditionSelector;