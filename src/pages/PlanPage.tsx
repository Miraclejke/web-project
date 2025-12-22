import { useState } from 'react';
import DayPicker from '../components/DayPicker';
import PlanExerciseList from '../components/PlanExerciseList';
import { useAppStore } from '../store/useAppStore';
import type { WeekdayKey } from '../store/types';
import { getWeekdayKey, WEEK_DAYS } from '../utils/date';

export default function PlanPage() {
  const [selectedDay, setSelectedDay] = useState<WeekdayKey>(() => getWeekdayKey(new Date()));
  const { weeklyPlan, suggestions, actions } = useAppStore((state) => ({
    weeklyPlan: state.weeklyPlan,
    suggestions: state.suggestions,
    actions: state.actions,
  }));

  const dayInfo = WEEK_DAYS.find((day) => day.key === selectedDay);
  const exercises = weeklyPlan[selectedDay] ?? [];

  return (
    <div className="page">
      <section className="page-hero simple">
        <div>
          <h1>План</h1>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h2>{dayInfo?.label ?? 'День'}</h2>
          </div>
        </div>
        <DayPicker value={selectedDay} onChange={setSelectedDay} />
        <PlanExerciseList
          exercises={exercises}
          suggestions={suggestions}
          onAdd={() => actions.addPlanExercise(selectedDay)}
          onChange={(id, changes) => actions.updatePlanExercise(selectedDay, id, changes)}
          onRemove={(id) => actions.removePlanExercise(selectedDay, id)}
        />
      </section>
    </div>
  );
}