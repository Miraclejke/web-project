import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { getTodayISO, getWeekdayKey, WEEK_DAYS } from '../utils/date';

const DAYS_RANGE = 14;

function getPastDates(count: number) {
  const dates: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

export default function DashboardPage() {
  const today = getTodayISO();
  const dayKey = getWeekdayKey(new Date());
  const dayLabel = WEEK_DAYS.find((day) => day.key === dayKey)?.label ?? '';

  const { workouts, nutrition, rest } = useAppStore((state) => ({
    workouts: state.workouts,
    nutrition: state.nutrition,
    rest: state.rest,
  }));

  const stats = useMemo(() => {
    const dates = getPastDates(DAYS_RANGE);
    let workoutDays = 0;
    let caloriesSum = 0;
    let caloriesDays = 0;
    let sleepSum = 0;
    let sleepDays = 0;

    dates.forEach((date) => {
      if (workouts[date]?.exercises.length) {
        workoutDays += 1;
      }

      const meals = nutrition[date]?.meals ?? [];
      const dayCalories = meals.reduce((total, meal) => {
        return meal.calories !== undefined ? total + meal.calories : total;
      }, 0);
      const hasCalories = meals.some((meal) => meal.calories !== undefined);
      if (hasCalories) {
        caloriesSum += dayCalories;
        caloriesDays += 1;
      }

      const sleepHours = rest[date]?.sleepHours;
      if (sleepHours !== undefined) {
        sleepSum += sleepHours;
        sleepDays += 1;
      }
    });

    return {
      workoutDays,
      avgCalories: caloriesDays ? Math.round(caloriesSum / caloriesDays) : 0,
      avgSleep: sleepDays ? Math.round((sleepSum / sleepDays) * 10) / 10 : 0,
      caloriesDays,
      sleepDays,
    };
  }, [workouts, nutrition, rest]);

  return (
    <div className="page">
      <section className="page-hero simple">
        <div>
          <h1>Дашборд</h1>
          <p className="muted">
            {today} {dayLabel}
          </p>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="simple-card">
          <div className="simple-title">За 14 дней</div>
          <div className="muted">Тренировок: {stats.workoutDays}</div>
          <div className="muted">Калорий в среднем: {stats.avgCalories || '—'}</div>
          <div className="muted">Сон в среднем: {stats.avgSleep || '—'} ч</div>
        </div>
        <div className="simple-card">
          <div className="simple-title">Тренировка</div>
          <div className="muted">Сегодня</div>
          <Link to={`/workout/${today}`}>
            <Button variant="subtle">Открыть</Button>
          </Link>
        </div>
        <div className="simple-card">
          <div className="simple-title">Питание</div>
          <div className="muted">Сегодня</div>
          <Link to={`/nutrition/${today}`}>
            <Button variant="subtle">Открыть</Button>
          </Link>
        </div>
        <div className="simple-card">
          <div className="simple-title">Отдых</div>
          <div className="muted">Сегодня</div>
          <Link to={`/rest/${today}`}>
            <Button variant="subtle">Открыть</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
