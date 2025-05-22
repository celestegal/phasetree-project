export interface SimulationData {
  id: string;
  timestamp: string;
  value: number | null | string;
  parameter_set: string;
  status: string;
  performance_index: number;
}

// data validation
const isValidSimulationData = (obj: any): obj is SimulationData => {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.timestamp === "string" &&
    (typeof obj.value === "number" || obj.value === null || typeof obj.value === "string") &&
    typeof obj.parameter_set === "string" &&
    typeof obj.status === "string" 
  );
};

// fetch simulation data from JSON 
export const fetchData = async (): Promise<SimulationData[]> => {
  try {
    const res = await fetch("/simulation_data.json");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const rawData = await res.json();
    // ensures the fetch data is an array
    if (!Array.isArray(rawData)) {
      throw new Error("Data is not an array");
    }

    const validData = rawData.filter(isValidSimulationData);

    return validData;
  } catch (e) {
    console.error("Error loading data:", e);
    return [];
  }
};


