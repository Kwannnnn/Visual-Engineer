import { useState, useEffect } from 'react';

export default function useAPIUtil(utilityFunction: () => Promise<any>) {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await utilityFunction();
        if (!result) return;

        setData(result);
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, [utilityFunction]);

  return { data, error };
}
