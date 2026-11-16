import { useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import { useCarUiStore } from "../store/useCarUiStore";

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => Promise<void>;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isFavorite = useCarUiStore((state) =>
    state.favoriteCarIds.includes(car.id),
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
          onClick={() => toggleFavorite(car.id)}
        >
          Ulubiony
        </button>
        <button
          type="button"
          className="delete-button"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Usuwanie..." : "Usuń"}
        </button>
      </div>
    </article>
  );
}
