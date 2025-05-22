import type { SimulationData } from "./fetchData";

export const transformData = (data: SimulationData[]): SimulationData[] => {
  return data.map(entry => {
    const day = new Date(entry.timestamp).getUTCDate();
    const len = entry.parameter_set?.length ?? 0;
    const val = typeof entry.value === 'number' ? entry.value : NaN;

    let performance_index = 0;
    if (!isNaN(val) && day && len) {
      if (entry.status === "completed") {
        performance_index = (val / (day * len)) * 100;
      } else if (entry.status === "running" || entry.status === "pending") {
        performance_index = val / 2;
      } else if (entry.status === "failed") {
        performance_index = 0; 
      }
    }

    return {
      ...entry,
      performance_index: Math.round(performance_index * 100) / 100,
    };
  });
};
