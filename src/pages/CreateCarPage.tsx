import { useState } from "react";
import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { createCar } from "../services/carService";
import type { NewCar } from "../models/Car";
import CarInputForm from "../components/CarInputForm";

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
      <CarInputForm
        car={car}
        title="Podaj dane samochodu:"
        submitLabel="Dodaj samochód"
        isSubmitting={isLoading}
        onChange={setCar}
        onSubmit={handleCreateCar}
        onCancel={() => navigate("/cars")}
      />
    </section>
  );
}