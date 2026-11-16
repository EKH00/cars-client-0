import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import type { NewCar } from "../models/Car";
import { getCarById, updateCar } from "../services/carService";
import CarInputForm from "../components/CarInputForm";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<NewCar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
        const loadedCar = await getCarById(carId, controller.signal);
        const { brand, model, doorsNumber, luggageCapacity, engineCapacity,
          fuelType, productionDate, averageFuelConsumption, bodyType } = loadedCar;
        setCar({
          brand,
          model,
          doorsNumber,
          luggageCapacity,
          engineCapacity,
          fuelType,
          productionDate,
          averageFuelConsumption,
          bodyType,
        });
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

    void loadCar();
    return () => controller.abort();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !car) {
      setError("Nie można edytować nieistniejącego samochodu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await updateCar(id, car);
      navigate(`/cars/${id}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Wystąpił nieznany błąd.",
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

  if (!car) {
    return <p>Nie znaleziono samochodu.</p>;
  }

  return (
    <section className="car-update">
      <CarInputForm
        car={car}
        title="Edytuj dane samochodu:"
        submitLabel="Zatwierdź"
        isSubmitting={isLoading}
        onChange={setCar}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/cars/${id}`)}
      />
    </section>
  );
}