import { useState, useEffect } from 'react';

export default function useAPIUtil<T>(utilityFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await utilityFunction();
        setData(result);
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, [utilityFunction]);

  return { data, error };
}
