import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const useFetch = (url, options = { lazy: false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.lazy);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async (overrideUrl = url, body = null, method = "GET") => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === "POST") {
        response = await api.post(overrideUrl, body);
      } else if (method === "PUT") {
        response = await api.put(overrideUrl, body);
      } else if (method === "DELETE") {
        response = await api.delete(overrideUrl);
      } else {
        response = await api.get(overrideUrl);
      }
      setData(response.data);
      return { success: true, payload: response.data };
    } catch (err) {
      const parsedError = err.response?.data?.message || "Remote dataset fetching breakdown.";
      setError(parsedError);
      return { success: false, error: parsedError };
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!options.lazy) {
      executeFetch();
    }
  }, [executeFetch, options.lazy]);

  return { data, loading, error, refetch: executeFetch };
};

export default useFetch;