import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="dashboard" element={<div>Dashboard Page</div>} />
    </Routes>
  );
}
