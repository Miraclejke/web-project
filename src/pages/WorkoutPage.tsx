import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import WorkoutExerciseList from '../components/WorkoutExerciseList';
import { useAppStore } from '../store/useAppStore';
import { getTodayISO, isValidISODate } from '../utils/date';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const params = useParams();
  const today = getTodayISO();
  const date = params.date && isValidISODate(params.date) ? params.date : today;

  const { workout, suggestions, actions } = useAppStore((state) => ({
    workout: state.workouts[date],
    suggestions: state.suggestions,
    actions: state.actions,
  }));

  useEffect(() => {
    if (params.date && !isValidISODate(params.date)) {
      navigate(`/workout/${today}`, { replace: true });
    }
  }, [navigate, params.date, today]);

  const exercises = workout?.exercises ?? [];

  return (
    <div className="page">
      <section className="page-hero simple">
        <div>
          <h1>Тренировка</h1>
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
                navigate(`/workout/${value}`);
              }
            }}
          />
        </div>

        {!workout ? (
          <div className="empty-card">
            <Button variant="primary" onClick={() => actions.createWorkoutDay(date)}>
              Создать
            </Button>
          </div>
        ) : (
          <WorkoutExerciseList
            exercises={exercises}
            suggestions={suggestions}
            onAddExercise={() => actions.addWorkoutExercise(date)}
            onUpdateExercise={(id, changes) => actions.updateWorkoutExercise(date, id, changes)}
            onRemoveExercise={(id) => actions.removeWorkoutExercise(date, id)}
            onAddSet={(exerciseId) => actions.addWorkoutSet(date, exerciseId)}
            onUpdateSet={(exerciseId, setId, changes) =>
              actions.updateWorkoutSet(date, exerciseId, setId, changes)
            }
            onRemoveSet={(exerciseId, setId) => actions.removeWorkoutSet(date, exerciseId, setId)}
          />
        )}
      </section>
    </div>
  );
}