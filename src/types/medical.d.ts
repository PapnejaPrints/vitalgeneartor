export interface VitalRangeParsed {
  min: number;
  max: number;
}

export interface ConditionVitalsParsed {
  bloodPressure?: {
    systolic: VitalRangeParsed;
    diastolic: VitalRangeParsed;
  };
  heartRate?: VitalRangeParsed;
  spo2?: VitalRangeParsed;
  glucose?: VitalRangeParsed;
  temperature?: VitalRangeParsed;
}

// Raw types from the JSON file
export interface RawBloodPressureRange {
  Systolic: string;
  Diastolic: string;
}

export interface RawTemperatureRange {
  Celsius: string;
  Fahrenheit: string;
}

export interface RawConditionData {
  "Blood Pressure"?: RawBloodPressureRange;
  "Heart Rate"?: string;
  "SpO2"?: string;
  "Glucose"?: string;
  "Temperature"?: RawTemperatureRange;
}

export interface RawMedicalConditionsJson {
  [category: string]: {
    [condition: string]: RawConditionData;
  };
}