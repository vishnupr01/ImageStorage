import React, { useContext, useEffect, useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MainAuth() {
  const navigate=useNavigate()
  const {isAuthenticated} =useContext(AuthContext)

  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]); 

  const changeState = (data) => {
    setIsLogin(data)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-11/12 max-w-4xl">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">
            {isLogin ? 'Login' : 'Register'}
          </h1>
          {isLogin ? <Login /> : <Register onSet={changeState} />}
          <div className="mt-4 text-center">
            <p
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </p>
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-pink-500 to-red-500 p-8 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Secure Image Storage</h1>
          <p className="mt-4">
            Safely store, organize, and access your images anytime, anywhere. Enjoy fast uploads, secure backups, and easy sharing options.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainAuth;
