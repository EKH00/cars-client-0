import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../components/CarCard";
import type { Car } from "../models/Car";
import { deleteCar, getCars } from "../services/carService";
import { useCarUiStore } from "../store/useCarUiStore";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore(
    (state) => state.setShowFavoritesOnly,
  );
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);
    const matchesFavorite =
      !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);
        setCars(await getCars(controller.signal));
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Wystąpił nieznany błąd.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCars();
    return () => controller.abort();
  }, []);

  async function handleDeleteCar(id: string) {
    try {
      setError(null);
      await deleteCar(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
      removeFavorite(id);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Wystąpił nieznany błąd.",
      );
    }
  }

  if (isLoading) {
    return <p>Ładowanie danych...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }
  if (cars.length === 0) {
    return <p>Nie znaleziono samochodów.</p>;
  }

  return (
    <section className="cars-page">
      <h1>Samochody</h1>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Tylko ulubione
        </label>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {cars.length === 0 ? (
        <p>Nie znaleziono samochodów.</p>
      ) : visibleCars.length === 0 ? (
        <p>Brak samochodów pasujących do wybranych filtrów.</p>
      ) : (
        <div className="cars-list">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDeleteCar} />
          ))}
        </div>
      )}
    </section>
  );
}
