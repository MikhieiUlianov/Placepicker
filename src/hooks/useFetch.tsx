import { useEffect, useState } from "react";
import { Place } from "../App";

export default function useFetch(fetchFn: () => Place[], initalValue: Place[]) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [fetchedData, setFetchedData] = useState<Place[]>(initalValue);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError({ message: error.message });
        } else {
          setError({ message: "Failed to fetch Data." });
        }
      }

      setIsFetching(false);
    }

    fetchData();
  }, [fetchFn]);

  return { isFetching, error, fetchedData, setFetchedData };
}
