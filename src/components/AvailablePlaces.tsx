import { Place } from "../App.js";
import Places from "./Places.js";

export default function AvailablePlaces({
  onSelectPlace,
}: {
  onSelectPlace: (selectedPlace: Place) => void;
}) {
  return (
    <Places
      title="Available Places"
      places={[]}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
