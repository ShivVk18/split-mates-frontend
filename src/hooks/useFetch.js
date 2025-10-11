import api from "@/utils/AxiosInstance";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchData = async () => {
    console.log("📡 Fetch start:", url);
    setLoading(true);

    try { 
        await delay(500);
      const response = await api.get(url);
      console.log("✅ API success:", response.data);

      setData(response.data.data);
      setError(null);
    } catch (err) {
      console.error("❌ API error:", err);
      setError(err);
    } finally {
      setLoading(false);
      console.log("⏳ Fetch finished -> loading:", false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  // Debug every render
  useEffect(() => {
    console.log("🎯 useFetch state ->", { data, loading, error });
  }, [data, loading, error]);

  return [data, loading, error];
};

export default useFetch;
