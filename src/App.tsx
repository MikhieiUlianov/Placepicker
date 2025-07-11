import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces";

import { updateUserPlaces, fetchUserPlaces } from "./http.js";
import ErrorMessage from "./components/ErrorMessage.js";

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

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [userPlaces, setUserPlaces] = useState<Place[]>([]);

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState<{
    message: string;
  } | null>();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setIsFetching(true);
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        if (error instanceof Error) {
          setError({ message: error.message });
        } else {
          setError({ message: "Failed to update Places." });
        }
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, [fetchUserPlaces]);

  function handleStartRemovePlace(place: Place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace: Place) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (!prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return [selectedPlace, ...prevPickedPlaces];
      }
      return prevPickedPlaces;
    });
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      if (error instanceof Error) {
        setErrorUpdatingPlaces({ message: error.message });
      } else {
        setErrorUpdatingPlaces({ message: "Failed to update Places." });
      }
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      if (!selectedPlace.current) return;
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current!.id
        )
      );

      try {
        await updateUserPlaces(
          userPlaces.filter((i) => i.id !== selectedPlace.current!.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        if (error instanceof Error) {
          setErrorUpdatingPlaces({ message: error.message });
        } else {
          setErrorUpdatingPlaces({ message: "Failed to update Places." });
        }
      }
      setModalIsOpen(false);
    },
    [userPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces ? true : false} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorMessage
            title="An error occured"
            message={errorUpdatingPlaces?.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
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
        {error && (
          <ErrorMessage
            title="An error occured"
            message={error.message}
            onConfirm={() => {}}
          />
        )}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
            isLoading={isFetching}
            loadingText="Fetching your places..."
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
