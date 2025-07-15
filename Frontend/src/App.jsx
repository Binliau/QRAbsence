import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from "../views/HomeView";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import GenerateQRView from "../views/GenerateQRView";
import AbsensiView from "../views/AbsensiView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView/>} />
        <Route path="/login" element={<LoginView/>} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/generate" element={<GenerateQRView />} />
        <Route path="/absensiview" element={<AbsensiView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
