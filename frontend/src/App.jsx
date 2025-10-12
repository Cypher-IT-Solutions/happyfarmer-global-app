import HealthCheck from "./components/HealthCheck";
import TestTable from "./components/TestTable";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Food Delivery Backend Health</h1>
      <HealthCheck />
      <TestTable />
    </div>
  );
}

export default App;
