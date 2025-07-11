import { useRef, useState, useCallback } from "react";

import Places from "./components/Places";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces";

// Define types
type PlaceImage = {
  src: string;
  alt: string;
};

export type Place = {
  id: string;
  title: string;
  image: PlaceImage;
  lat: number;
  lon: number;
};

function App() {
  const selectedPlace = useRef<Place | null>(null);

  const [userPlaces, setUserPlaces] = useState<Place[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleStartRemovePlace(place: Place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(selectedPlace: Place) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return [selectedPlace, ...prevPickedPlaces];
      }
      return prevPickedPlaces;
    });
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    if (!selectedPlace.current) return;
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current!.id)
    );
    setModalIsOpen(false);
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
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
