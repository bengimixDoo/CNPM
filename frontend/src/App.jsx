import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Login.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
