import { RawConditionData, ConditionVitalsParsed, VitalRangeParsed } from "@/types/medical";

function parseNumericRange(rangeStr: string): VitalRangeParsed | undefined {
  // Handle ranges like "90-120", "36.1-37.2"
  const rangeMatch = rangeStr.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
  if (rangeMatch) {
    return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[3]) };
  }
  // Handle "<140"
  const lessThanMatch = rangeStr.match(/<(\d+(\.\d+)?)/);
  if (lessThanMatch) {
    return { min: 0, max: parseFloat(lessThanMatch[1]) - 0.1 }; // Slightly less than the upper bound
  }
  // Handle exact values like "95"
  const exactMatch = rangeStr.match(/^(\d+(\.\d+)?)$/);
  if (exactMatch) {
    const val = parseFloat(exactMatch[1]);
    return { min: val, max: val };
  }
  // For complex strings like glucose, try to extract the first range
  const complexRangeMatch = rangeStr.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
  if (complexRangeMatch) {
    return { min: parseFloat(complexRangeMatch[1]), max: parseFloat(complexRangeMatch[3]) };
  }
  return undefined;
}

export function parseRawConditionData(rawData: RawConditionData): ConditionVitalsParsed {
  const parsedVitals: ConditionVitalsParsed = {};

  if (rawData["Blood Pressure"]) {
    const systolicRange = parseNumericRange(rawData["Blood Pressure"].Systolic);
    const diastolicRange = parseNumericRange(rawData["Blood Pressure"].Diastolic);
    if (systolicRange && diastolicRange) {
      parsedVitals.bloodPressure = {
        systolic: systolicRange,
        diastolic: diastolicRange,
      };
    }
  }

  if (rawData["Heart Rate"]) {
    parsedVitals.heartRate = parseNumericRange(rawData["Heart Rate"]);
  }

  if (rawData["SpO2"]) {
    parsedVitals.spo2 = parseNumericRange(rawData["SpO2"]);
  }

  if (rawData["Glucose"]) {
    parsedVitals.glucose = parseNumericRange(rawData["Glucose"]);
  }

  if (rawData["Temperature"]) {
    // The temperature in the JSON is in Fahrenheit, so we parse Fahrenheit range
    parsedVitals.temperature = parseNumericRange(rawData["Temperature"].Fahrenheit);
  }

  return parsedVitals;
}