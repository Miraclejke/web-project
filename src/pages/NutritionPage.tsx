import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import MealList from '../components/MealList';
import { useAppStore } from '../store/useAppStore';
import { getTodayISO, isValidISODate } from '../utils/date';

export default function NutritionPage() {
  const navigate = useNavigate();
  const params = useParams();
  const today = getTodayISO();
  const date = params.date && isValidISODate(params.date) ? params.date : today;

  const { nutritionDay, actions } = useAppStore((state) => ({
    nutritionDay: state.nutrition[date],
    actions: state.actions,
  }));

  useEffect(() => {
    if (params.date && !isValidISODate(params.date)) {
      navigate(`/nutrition/${today}`, { replace: true });
    }
  }, [navigate, params.date, today]);

  const meals = nutritionDay?.meals ?? [];

  const totals = meals.reduce(
    (acc, meal) => {
      if (meal.calories !== undefined) acc.calories += meal.calories;
      if (meal.protein !== undefined) acc.protein += meal.protein;
      if (meal.fat !== undefined) acc.fat += meal.fat;
      if (meal.carbs !== undefined) acc.carbs += meal.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const hasTotals = meals.some(
    (meal) =>
      meal.calories !== undefined ||
      meal.protein !== undefined ||
      meal.fat !== undefined ||
      meal.carbs !== undefined
  );

  return (
    <div className="page">
      <section className="page-hero simple">
        <div>
          <h1>Питание</h1>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h2>Дата</h2>
          </div>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(event) => {
              const value = event.target.value;
              if (value) {
                navigate(`/nutrition/${value}`);
              }
            }}
          />
        </div>

        {!nutritionDay ? (
          <div className="empty-card">
            <Button variant="primary" onClick={() => actions.createNutritionDay(date)}>
              Создать
            </Button>
          </div>
        ) : (
          <>
            <MealList
              meals={meals}
              onAdd={() => actions.addMealEntry(date)}
              onChange={(id, changes) => actions.updateMealEntry(date, id, changes)}
              onRemove={(id) => actions.removeMealEntry(date, id)}
            />
            {hasTotals && (
              <div className="totals">
                <h3>Итого</h3>
                <div className="totals-grid">
                  <div>Калории: {totals.calories} ккал</div>
                  <div>Белки: {totals.protein} г</div>
                  <div>Жиры: {totals.fat} г</div>
                  <div>Углеводы: {totals.carbs} г</div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}