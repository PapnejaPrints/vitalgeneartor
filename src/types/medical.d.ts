export interface VitalRange {
  min: number;
  max: number;
}

export interface ConditionVitals {
  bloodPressure?: {
    systolic: VitalRange;
    diastolic: VitalRange;
  };
  heartRate?: VitalRange;
  spo2?: VitalRange;
  glucose?: VitalRange;
  temperature?: VitalRange;
}

export interface SubCondition {
  id: string;
  label: string;
  vitals?: ConditionVitals;
}

export interface Condition {
  id: string;
  label: string;
  vitals?: ConditionVitals;
  subConditions?: SubCondition[];
}

export interface MedicalConditionCategory {
  category: string;
  conditions: Condition[];
}

// New root interface for the JSON data
export interface MedicalConditionsRoot {
  categories: MedicalConditionCategory[];
}