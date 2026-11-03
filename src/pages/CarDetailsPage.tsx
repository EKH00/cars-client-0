import { useEffect, useState } from "react";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import { useNavigate, useParams } from "react-router";

export default function CarDetails() {
  const [car, setCar] = useState<Car | null>(null);
  // Czy w trakcie pobierania danych. Po pierwszym renderowaniu komponent
  // dopiero rozpocznie pobieranie danych.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // czy jest błąd

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {

    if (!id) {
      setError("Nie podano identyfikatora samochodu.");
      return;
    }
    // AbortController jest mechanizmem udostępnianym przez przeglądarkę,
    // a nie specjalną funkcją Reacta. Służy do sygnalizowania, że określona
    // operacja asynchroniczna powinna zostać anulowana.
    const controller = new AbortController();

    // Funkcja pobierające dane z backendu tzw. "kod efektu". Wywołujemy ją niżej.
    async function loadCar(id: string) {
      try {
        setIsLoading(true);
        setError(null);
        // Funkcji getCarById przekazujemy sygnał anulowania
        const loadedCar = await getCarById(id, controller.signal);
        setCar(loadedCar);
      } catch (caughtError) {
        if (
          // Anulowanie żądania
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError("Wystąpił nieznany błąd.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }


    loadCar(id);

    // Jeśli komponent zostanie odmontowany, to mamy możliwość ,,sprzątania" (anulujemy żądanie).
    return () => {
      controller.abort();
    };
  }, []); // Puste nawiasy [] oznaczają, że efekt jest niezależny od stanu, tzn.
  // wykona się tylko raz po wyrenderowaniu komponentu.

  if (isLoading) {
    return <p>Ładowanie danych...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (car === null) {
    return <p>Nie znaleziono samochodu.</p>;
  }

  return (
    <section className="car-details">
        {/* // React potrzebuje klucza key, aby identyfikować elementy listy pomiędzy */}
        {/* // kolejnymi renderowaniami. Dzięki temu może poprawnie powiązać elementy, */}
        {/* // gdy lista zostanie zmieniona. */}
        <article key={car.id} className="car-card">
            <h2>
            {car.brand} {car.model}
            </h2>
            <p>Liczba drzwi: {car.doorsNumber}</p>
            <p>Pojemność bagażnika: {car.luggageCapacity}</p>
            <p>Pojemność silnika: {car.engineCapacity}</p>
            <p>Rodzaj paliwa: {car.fuelType}</p>
            <p>Data produkcji: {car.productionDate}</p>
            <p>Średnie spalanie: {car.averageFuelConsumption}</p>
            <p>Typ nadwozia: {car.bodyType}</p>

            <p><button onClick={() => navigate(`/cars/${car.id}/edit`)}>Edytuj</button></p>

            <p><button onClick={() => navigate('/cars')}>Powrót</button></p>
        </article>

    </section>
  );
}