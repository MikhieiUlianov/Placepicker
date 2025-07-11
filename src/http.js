// every promise decorated function return a promise

export async function fetchAvailiblePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();
  if (!response.ok) {
    throw new Error("fetchinf error occured");
  }

  return resData.places;
}
