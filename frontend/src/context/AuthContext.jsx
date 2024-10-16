import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const authStatus = localStorage.getItem('isAuthenticated');
console.log("storedToken:",storedToken);
console.log("authStatus:",authStatus);

    if (storedToken && authStatus === 'true') {
      console.log("Setting isAuthenticated to true");
      setIsAuthenticated(true);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setIsAuthenticated(true);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  };
console.log("iscorrect:",isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
