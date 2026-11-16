import type { FormEventHandler } from "react";
import type { NewCar } from "../models/Car";

interface CarInputFormProps {
  car: NewCar;
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  onChange: (car: NewCar) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
}

type NumericCarField =
  | "doorsNumber"
  | "luggageCapacity"
  | "engineCapacity"
  | "fuelType"
  | "averageFuelConsumption"
  | "bodyType";

export default function CarInputForm({
  car,
  title,
  submitLabel,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: CarInputFormProps) {
  function updateNumber(field: NumericCarField, value: string) {
    onChange({ ...car, [field]: Number(value) });
  }

  return (
    <form className="car-input-form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      <label>
        Marka:
        <input
          required
          type="text"
          value={car.brand}
          onChange={(event) => onChange({ ...car, brand: event.target.value })}
        />
      </label>
      <label>
        Model:
        <input
          required
          type="text"
          value={car.model}
          onChange={(event) => onChange({ ...car, model: event.target.value })}
        />
      </label>
      <label>
        Liczba drzwi:
        <input
          type="number"
          value={car.doorsNumber}
          onChange={(event) => updateNumber("doorsNumber", event.target.value)}
        />
      </label>
      <label>
        Pojemność bagażnika:
        <input
          type="number"
          value={car.luggageCapacity}
          onChange={(event) =>
            updateNumber("luggageCapacity", event.target.value)
          }
        />
      </label>
      <label>
        Pojemność silnika:
        <input
          type="number"
          value={car.engineCapacity}
          onChange={(event) =>
            updateNumber("engineCapacity", event.target.value)
          }
        />
      </label>
      <label>
        Rodzaj paliwa:
        <input
          type="number"
          value={car.fuelType}
          onChange={(event) => updateNumber("fuelType", event.target.value)}
        />
      </label>
      <label>
        Data produkcji:
        <input
          required
          type="date"
          value={car.productionDate.slice(0, 10)}
          onChange={(event) =>
            onChange({ ...car, productionDate: event.target.value })
          }
        />
      </label>
      <label>
        Średnie spalanie:
        <input
          type="number"
          step="any"
          value={car.averageFuelConsumption}
          onChange={(event) =>
            updateNumber("averageFuelConsumption", event.target.value)
          }
        />
      </label>
      <label>
        Typ nadwozia:
        <input
          type="number"
          value={car.bodyType}
          onChange={(event) => updateNumber("bodyType", event.target.value)}
        />
      </label>
      <div className="car-input-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Powrót
        </button>
      </div>
    </form>
  );
}
