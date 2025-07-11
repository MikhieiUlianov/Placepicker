import { useEffect, useState } from "react";
import { Place } from "../App.js";
import Places from "./Places.js";

export default function AvailablePlaces({
  onSelectPlace,
}: {
  onSelectPlace: (selectedPlace: Place) => void;
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      const response = await fetch("http://localhost:3000/places");
      const resData = await response.json();
      setAvailablePlaces(resData.places);
      setIsFetching(false);
    }
    /*     fetch("http://localhost:3000/places")
      .then((response) => response.json())
      .then((resData) => setAvailablePlaces(resData.places)); */
    fetchPlaces();
  }, []);

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
