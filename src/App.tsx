import React, { useEffect, useState } from "react";
import { fetchData } from "./utils/fetchData";
import { transformData } from "./utils/transformData";
import SimulationTable from "./components/SimulationTable";
import { StatusBarChart } from "./components/StatusBarChart";
import type { SimulationData } from "./utils/fetchData";
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState<SimulationData[]>([]);

  useEffect(() => {
    fetchData()
      .then((raw) => setData(transformData(raw)))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Simulation Dashboard</h1>

      {/* Grafico barre per status */}
      <div style={{ marginBottom: 40 }}>
        <StatusBarChart data={data} />
      </div>

      {/* Tabella dati */}
      <SimulationTable data={data} />
    </div>
  );
};

export default App;
