import { useState, useEffect } from "react";

/**
 * Custom hook để fetch data từ API
 * @param {Function} apiFunction - Function gọi API từ services
 * @param {Array} dependencies - Dependencies để re-fetch
 * @param {boolean} immediate - Có gọi ngay khi mount không (default: true)
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: execute };
};

/**
 * Custom hook cho auth state
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  // Đọc token một lần khi khởi tạo hook, không cần setState trong effect
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token")
  );
  const [loading] = useState(false); // Đồng bộ, không cần chờ async

  return { user, isAuthenticated, loading, setUser, setIsAuthenticated };
};
