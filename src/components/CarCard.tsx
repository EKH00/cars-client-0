import { useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => Promise<void>;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const user =
      useAuthStore(
        (state) => state.user,
      );

  const isAdmin =
    user?.roles.includes('Admin')
    ?? false;
    
  const [isDeleting, setIsDeleting] = useState(false);
  
  const favoriteCarIdsByUser =
    useCarUiStore(
      (state) =>
        state.favoriteCarIdsByUser,
    );

  const favoriteCarIds =
    user
      ? favoriteCarIdsByUser[user.id] ?? []
      : [];
    const isFavorite =
      favoriteCarIds.includes(
        car.id,
      );

  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  async function handleDelete() {
    if (!window.confirm("Czy na pewno chcesz usunąć ten samochód?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(car.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="car-card">
      <div className="car-card-info">
        <h2>
          <Link to={`/cars/${car.id}`}>
            {car.brand} {car.model}
          </Link>
        </h2>
        <p>Rok produkcji: {car.productionDate.slice(0, 4)}</p>
        <p>Pojemność silnika: {car.engineCapacity} cm³</p>
        <p>Spalanie: {car.averageFuelConsumption} l/100 km</p>
      </div>

      <div className="car-card-actions">
        <button
          type="button"
          className={isFavorite ? "favorite-button active-favorite" : "favorite-button"}
          aria-pressed={isFavorite}
          onClick={() => {if (user) { toggleFavorite(user.id, car.id); } } }
        >
          Ulubiony
        </button>
        {isAdmin && (
          <button
            type="button"
            className="delete-button"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Usuwanie..." : "Usuń"}
          </button>
        )}
      </div>
    </article>
  );
}
