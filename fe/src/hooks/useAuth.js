// Global custom hook for authentication
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Giả lập kiểm tra xác thực (có thể thay bằng logic thực tế như kiểm tra token)
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
}
