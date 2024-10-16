import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainAuth from './pages/MainAuth';
import ImageUploadComponent from './components/Home';// Import your Header component
import { Toaster } from 'react-hot-toast';
import MainOne from './pages/MainOne';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ProtectedRoutes } from './protected/Protected';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div>

        <Toaster />

        {/* Add the Header here */}
        <Routes>
          <Route path='/login' element={<MainAuth />} />
          <Route path='/' element={ <ProtectedRoutes>
            <MainOne/>
          </ProtectedRoutes>} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}


export default App;
