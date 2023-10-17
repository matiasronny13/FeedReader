import { useState, useCallback } from 'react';

interface UseAsyncRetryResult<Data> {
  data: Data | null;
  error: Error | null;
  isLoading: boolean;
  execute: () => Promise<void>;
}

const useAsyncRetry = <Data>(
  asyncFunction: () => Promise<Data>,
  maxRetries: number = 5,
  retryDelay: number = 60000 // 1 minute in milliseconds
): UseAsyncRetryResult<Data> => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeAsyncFunction = useCallback(async () => {
    setIsLoading(true);

    let retries = maxRetries;
    while (retries > 0) {
      try {
        const result = await asyncFunction();
        setData(result);
        setIsLoading(false);
        return;
      } catch (error) {
        setError(error as Error);
      }

      // Delay for the retry
      if (retries > 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      retries--;
    }

    setIsLoading(false);
  }, [asyncFunction, maxRetries, retryDelay]);

  return { data, error, isLoading, execute: executeAsyncFunction };
};

export default useAsyncRetry;
