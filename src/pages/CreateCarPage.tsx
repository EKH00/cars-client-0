import { useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { createCar } from "../services/carService";
import type { NewCar } from "../models/Car";

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [car, setCar] = useState<NewCar>({
    brand: "",
    model: "",
    doorsNumber: 0,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 0,
    productionDate: "",
    averageFuelConsumption: 0,
    bodyType: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateCar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createCar(car);
      navigate("/cars");
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

  return (
    <section className="car-create">
        <form id="create-car-form" onSubmit={handleCreateCar}>      
            <h2>
            Podaj dane samochodu:
            </h2>
            <p>Marka:
                <input
                    type="text"
                    onChange={(e) => setCar({ ...car, brand: e.target.value })}
                    />
            </p>
            <p>Model:
                <input
                    type="text"
                    onChange={(e) => setCar({ ...car, model: e.target.value })}
                    />
            </p>
            <p>Liczba drzwi:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, doorsNumber: parseInt(e.target.value) })}
                    />
            </p>
            <p>Pojemność bagażnika:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, luggageCapacity: parseInt(e.target.value) })}
                    />
            </p>
            <p>Pojemność silnika:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, engineCapacity: parseInt(e.target.value) })}
                    />
            </p>
            <p>Rodzaj paliwa:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, fuelType: parseInt(e.target.value) })}
                    />
            </p>
            <p>Data produkcji:
                <input
                    type="date"
                    onChange={(e) => setCar({ ...car, productionDate: e.target.value })}
                    />
            </p>
            <p>Średnie spalanie:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, averageFuelConsumption: parseFloat(e.target.value) })}
                    />
            </p>
            <p>Typ nadwozia:
                <input
                    type="number"
                    onChange={(e) => setCar({ ...car, bodyType: parseInt(e.target.value) })}
                    />
            </p>

            <p><button type="submit" disabled={isLoading}>Zatwierdź</button></p>

            <p><button type="button" onClick={() => window.history.back()}>Powrót</button></p>
        </form>

    </section>
  );
}