import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPrescription from './pages/UploadPrescription';
import PrescriptionDetails from './pages/PrescriptionDetails';
import Medicines from './pages/Medicines';
import MedicalHistory from './pages/MedicalHistory';
import Appointments from './pages/Appointments';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 flex max-w-7xl w-full mx-auto">
              <Sidebar />

              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Healthcare Dashboard Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadPrescription />} />
                    <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
                    <Route path="/medicines" element={<Medicines />} />
                    <Route path="/medical-history" element={<MedicalHistory />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Routes>
              </main>
            </div>

            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
