import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "20px" }}>
        <h1>AI Document Validator</h1>
      </div>
    </div>
  );
}

export default App;