import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CallsList from "./pages/CallsList";
import CallDetail from "./pages/CallDetail";
import CallInterface from "./pages/CallInterface";
import UnresolvedQueries from "./pages/UnresolvedQueries";
import ScriptsManager from "./pages/ScriptsManager";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calls" element={<CallsList />} />
            <Route path="/calls/:id" element={<CallDetail />} />
            <Route path="/call" element={<CallInterface />} />
            <Route path="/unresolved" element={<UnresolvedQueries />} />
            <Route path="/scripts" element={<ScriptsManager />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
