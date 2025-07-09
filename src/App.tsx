import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.js";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.js";
import DeleteConfirmation from "./components/DeleteConfirmation.js";
import { sortPlacesByDistance } from "./loc.js";

import logoImg from "./assets/logo.png";

export type PlacesItem = {
  id: string;
  title: string;
  image: {
    src: any;
    alt: string;
  };
  lat: number;
  lon: number;
};

const storedIds: string[] = JSON.parse(
  localStorage.getItem("selectedPlaces") || "[]"
);
const storedPlaces: PlacesItem[] = storedIds
  .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
  .filter((place): place is PlacesItem => place !== undefined);

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef<string | null>(null);
  const [pickedPlaces, setPickedPlaces] = useState<PlacesItem[]>(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState<PlacesItem[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id: string) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      if (place) {
        return [place, ...prevPickedPlaces];
      }
      return prevPickedPlaces;
    });

    const storedIds: string[] = JSON.parse(
      localStorage.getItem("selectedPlaces") || "[]"
    );
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds: string[] = JSON.parse(
      localStorage.getItem("selectedPlaces") || "[]"
    );
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
