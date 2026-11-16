import { useEffect, useState } from "react";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { useCarUiStore } from "../store/useCarUiStore";

export default function CarCard() {
  const [car, setCar] = useState<Car>({} as Car);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const isFavorite =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.includes(
          car.id,
        ),
  );

  const toggleFavorite =
    useCarUiStore(
      (state) =>
        state.toggleFavorite,
  );

  useEffect(() => {

    if (!id) {
      setError("Nie podano identyfikatora samochodu.");
      return;
    }
    const controller = new AbortController();

    async function loadCar(id: string) {
      try {
        setIsLoading(true);
        setError(null);
        const loadedCar = await getCarById(id, controller.signal);
        setCar(loadedCar);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
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

    return () => {
      controller.abort();
    };
  }, []);

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
      <article className="car-details-card">
        <h2>
          {car.brand} {car.model}
        </h2>
        <dl className="car-details-list">
          <div><dt>Liczba drzwi</dt><dd>{car.doorsNumber}</dd></div>
          <div><dt>Pojemność bagażnika</dt><dd>{car.luggageCapacity}</dd></div>
          <div><dt>Pojemność silnika</dt><dd>{car.engineCapacity}</dd></div>
          <div><dt>Rodzaj paliwa</dt><dd>{car.fuelType}</dd></div>
          <div><dt>Data produkcji</dt><dd>{car.productionDate.slice(0, 10)}</dd></div>
          <div><dt>Średnie spalanie</dt><dd>{car.averageFuelConsumption}</dd></div>
          <div><dt>Typ nadwozia</dt><dd>{car.bodyType}</dd></div>
        </dl>
        <div className="car-details-actions">
          <button
            type="button"
            className={
              isFavorite
                ? "favorite-button active-favorite"
                : "favorite-button"
            }
            onClick={() => toggleFavorite(car.id)}
          >
            {isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          </button>
          <button type="button" onClick={() => navigate(`/cars/${car.id}/edit`)}>
            Edytuj
          </button>
          <button type="button" onClick={() => navigate("/cars")}>
            Powrót
          </button>
        </div>
      </article>
    </section>
  );
}