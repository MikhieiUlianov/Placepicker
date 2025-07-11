import { useEffect, useState } from "react";
import { Place } from "../App.js";
import Places from "./Places.js";
import ErrorMessage from "./ErrorMessage.js";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({
  onSelectPlace,
}: {
  onSelectPlace: (selectedPlace: Place) => void;
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });

        setIsFetching(false);
        // We use try/catch to safely handle unexpected errors during fetch.
        // TypeScript treats the `error` in `catch` as `unknown`, so we must narrow it.
        // If the error is an instance of Error, we can safely access `.message` (which is a string).
        // Otherwise, we manually set a fallback message string to avoid runtime issues.
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return (
      <ErrorMessage
        title="An error occured!"
        message={error.message}
        onConfirm={() => {}}
      />
    );
  }

  /*   useEffect(() => {
    fetch("http://localhost:3000/places")
      .then((response) => response.json())
      .then((resData) => {
        // Ensure resData is an array and matches Place type
        if (Array.isArray(resData)) {
          setAvailablePlaces(resData);
        } else if (Array.isArray(resData.places)) {
          setAvailablePlaces(resData.places);
        } else {
          setAvailablePlaces([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch places:", error);
        setAvailablePlaces([]);
      });
  }, []); */

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      isLoading={isFetching}
      loadingText="Fetching place data..."
      onSelectPlace={onSelectPlace}
    />
  );
}
