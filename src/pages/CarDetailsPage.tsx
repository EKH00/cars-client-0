import { useEffect, useState } from "react";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

export default function CarDetailsPage() {

  const user = useAuthStore((state) => state.user);

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const isAdmin =
    user?.roles.includes('Admin')
      ?? false;

  const favoriteCarIds =
    useCarUiStore(
      (state) =>
        user
          ? state.favoriteCarIdsByUser[
            user.id
          ] ?? []
            : [],
    );

  const toggleFavorite =
    useCarUiStore(
      (state) =>
        state.toggleFavorite,
    );

  const isFavorite =
    car !== null
      && favoriteCarIds.includes(car.id);

  useEffect(() => {

    if (!id) {
      setError("Nie podano identyfikatora samochodu.");
      setIsLoading(false);
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
  }, [id]);

  if (isLoading) {
    return <p>Ładowanie danych...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!car) {
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
            onClick={() => {if (user) {
              toggleFavorite(user.id, car.id);
            }}}
          >
            {isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          </button>
          {isAdmin && (
            <button type="button" onClick={() => navigate(`/cars/${car.id}/edit`)}>
              Edytuj
            </button>
          )}
          <button type="button" onClick={() => navigate("/cars")}>
            Powrót
          </button>
        </div>
      </article>
    </section>
  );
}