import { useState, useEffect } from 'react';

export default function useAPIUtil<T>(utilityFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    try {
      const result = await utilityFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetch();
  }, [utilityFunction]);

  return { data, error, fetch };
}
