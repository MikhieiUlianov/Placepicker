import { Place } from "../App.js";
import Places from "./Places.js";
import ErrorMessage from "./ErrorMessage.js";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import useFetch from "../hooks/useFetch.js";
import { useCallback } from "react";

export default function AvailablePlaces({
  onSelectPlace,
}: {
  onSelectPlace: (selectedPlace: Place) => void;
}) {
  const fetchSortedPlaces = useCallback(async function fetchSortedPlaces() {
    const places = await fetchAvailablePlaces();

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );

        resolve(sortedPlaces);
      });
    });
  }, []);
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, []);

  if (error) {
    return (
      <ErrorMessage
        title="An error occured!"
        message={error.message}
        onConfirm={() => {}}
      />
    );
  }

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
