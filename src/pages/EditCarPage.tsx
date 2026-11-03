import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { FormEvent } from "react";
import { updateCar, getCarById } from "../services/carService";
import type { NewCar } from "../models/Car";

export default function EditCarPage() {
  const navigate = useNavigate();
  const [newCar, setNewCar] = useState<NewCar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("Nie podano identyfikatora samochodu.");
      setIsLoading(false);
      return;
    }

    const carId = id;
    const controller = new AbortController();

    async function loadCar() {
      try {
        setIsLoading(true);
        setError(null);
        const loadedCar = await getCarById(carId, controller.signal);
        setNewCar({
          brand: loadedCar.brand,
          model: loadedCar.model,
          doorsNumber: loadedCar.doorsNumber,
          luggageCapacity: loadedCar.luggageCapacity,
          engineCapacity: loadedCar.engineCapacity,
          fuelType: loadedCar.fuelType,
          productionDate: loadedCar.productionDate,
          averageFuelConsumption: loadedCar.averageFuelConsumption,
          bodyType: loadedCar.bodyType,
        });
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

    loadCar();
    return () => controller.abort();
  }, []);

  async function handleEditCar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!id || !newCar) {
      setError("Nie można edytować nieistniejącego samochodu.");
      setIsLoading(false);
      return;
    }

    try {
      await updateCar(id, newCar);
      navigate(`/cars/${id}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Wystąpił nieznany błąd."
      );
    } finally {
      setIsLoading(false);
    }
  }

  

  if (isLoading) {
    return <p>Ładowanie danych...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!newCar) {
    return <p>Nie znaleziono samochodu.</p>;
  }

  return (
    <section className="car-update">
        <form id="update-car-form" onSubmit={handleEditCar}>      
            <h2>
            Edytuj dane samochodu:
            </h2>
            <p>Marka:
                <input
                    type="text"
                    value={newCar.brand}
                    onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                    />
            </p>
            <p>Model:
                <input
                    type="text"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    />
            </p>
            <p>Liczba drzwi:
                <input
                    type="number"
                    value={newCar.doorsNumber}
                    onChange={(e) => setNewCar({ ...newCar, doorsNumber: parseInt(e.target.value) })}
                    />
            </p>
            <p>Pojemność bagażnika:
                <input
                    type="number"
                    value={newCar.luggageCapacity}
                    onChange={(e) => setNewCar({ ...newCar, luggageCapacity: parseInt(e.target.value) })}
                    />
            </p>
            <p>Pojemność silnika:
                <input
                    type="number"
                    value={newCar.engineCapacity}
                    onChange={(e) => setNewCar({ ...newCar, engineCapacity: parseInt(e.target.value) })}
                    />
            </p>
            <p>Rodzaj paliwa:
                <input
                    type="number"
                    value={newCar.fuelType}
                    onChange={(e) => setNewCar({ ...newCar, fuelType: parseInt(e.target.value) })}
                    />
            </p>
            <p>Data produkcji:
                <input
                    type="date"
                    value={newCar.productionDate}
                    onChange={(e) => setNewCar({ ...newCar, productionDate: e.target.value })}
                    />
            </p>
            <p>Średnie spalanie:
                <input
                    type="number"
                    value={newCar.averageFuelConsumption}
                    onChange={(e) => setNewCar({ ...newCar, averageFuelConsumption: parseFloat(e.target.value) })}
                    />
            </p>
            <p>Typ nadwozia:
                <input
                    type="number"
                    value={newCar.bodyType}
                    onChange={(e) => setNewCar({ ...newCar, bodyType: parseInt(e.target.value) })}
                    />
            </p>

            <p><button type="submit" disabled={isLoading}>Zatwierdź</button></p>

            <p><button type="button" onClick={() => window.history.back()}>Powrót</button></p>
        </form>

    </section>
  );
}