import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  AppDataState,
  MealEntry,
  PlanExercise,
  RestDay,
  WeekdayKey,
  WorkoutDay,
  WorkoutExercise,
  WorkoutSet,
} from './types';
import { createId } from '../utils/id';
import { APP_STORAGE_KEY } from '../services/storage';

type AppStore = AppDataState & {
  actions: {
    addPlanExercise: (day: WeekdayKey) => void;
    updatePlanExercise: (day: WeekdayKey, id: string, changes: Partial<PlanExercise>) => void;
    removePlanExercise: (day: WeekdayKey, id: string) => void;
    createWorkoutDay: (date: string) => void;
    addWorkoutExercise: (date: string, name?: string) => void;
    updateWorkoutExercise: (date: string, id: string, changes: Partial<WorkoutExercise>) => void;
    removeWorkoutExercise: (date: string, id: string) => void;
    addWorkoutSet: (date: string, exerciseId: string) => void;
    updateWorkoutSet: (
      date: string,
      exerciseId: string,
      setId: string,
      changes: Partial<WorkoutSet>
    ) => void;
    removeWorkoutSet: (date: string, exerciseId: string, setId: string) => void;
    createNutritionDay: (date: string) => void;
    addMealEntry: (date: string) => void;
    updateMealEntry: (date: string, id: string, changes: Partial<MealEntry>) => void;
    removeMealEntry: (date: string, id: string) => void;
    createRestDay: (date: string) => void;
    updateRestDay: (date: string, changes: Partial<RestDay>) => void;
  };
};

const initialState: AppDataState = {
  weeklyPlan: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
  workouts: {},
  nutrition: {},
  rest: {},
  suggestions: [
    'Жим лежа',
    'Приседания',
    'Становая тяга',
    'Жим стоя',
    'Подтягивания',
    'Тяга в наклоне',
    'Выпады',
    'Жим ногами',
    'Сгибание рук',
    'Разгибание рук',
  ],
};

const addItem = <T,>(list: T[], item: T) => [...list, item];
const updateById = <T extends { id: string }>(list: T[], id: string, changes: Partial<T>) =>
  list.map((item) => (item.id === id ? { ...item, ...changes } : item));
const removeById = <T extends { id: string }>(list: T[], id: string) =>
  list.filter((item) => item.id !== id);

const emptyWorkoutDay = (date: string): WorkoutDay => ({ date, exercises: [] });
const emptyNutritionDay = (date: string) => ({ date, meals: [] });
const emptyRestDay = (date: string): RestDay => ({ date, isRest: false });

const updateWorkoutDay = (
  workouts: Record<string, WorkoutDay>,
  date: string,
  updater: (day: WorkoutDay) => WorkoutDay
) => ({
  ...workouts,
  [date]: updater(workouts[date] ?? emptyWorkoutDay(date)),
});

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      actions: {
        addPlanExercise: (day) =>
          set((state) => ({
            weeklyPlan: {
              ...state.weeklyPlan,
              [day]: addItem(state.weeklyPlan[day], { id: createId('plan'), name: '', note: '' }),
            },
          })),
        updatePlanExercise: (day, id, changes) =>
          set((state) => ({
            weeklyPlan: {
              ...state.weeklyPlan,
              [day]: updateById(state.weeklyPlan[day], id, changes),
            },
          })),
        removePlanExercise: (day, id) =>
          set((state) => ({
            weeklyPlan: {
              ...state.weeklyPlan,
              [day]: removeById(state.weeklyPlan[day], id),
            },
          })),
        createWorkoutDay: (date) =>
          set((state) => ({
            workouts: {
              ...state.workouts,
              [date]: state.workouts[date] ?? emptyWorkoutDay(date),
            },
          })),
        addWorkoutExercise: (date, name = '') =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: addItem(day.exercises, { id: createId('workout'), name, sets: [] }),
            })),
          })),
        updateWorkoutExercise: (date, id, changes) =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: updateById(day.exercises, id, changes),
            })),
          })),
        removeWorkoutExercise: (date, id) =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: removeById(day.exercises, id),
            })),
          })),
        addWorkoutSet: (date, exerciseId) =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, sets: addItem(exercise.sets, { id: createId('set') }) }
                  : exercise
              ),
            })),
          })),
        updateWorkoutSet: (date, exerciseId, setId, changes) =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, sets: updateById(exercise.sets, setId, changes) }
                  : exercise
              ),
            })),
          })),
        removeWorkoutSet: (date, exerciseId, setId) =>
          set((state) => ({
            workouts: updateWorkoutDay(state.workouts, date, (day) => ({
              ...day,
              exercises: day.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, sets: removeById(exercise.sets, setId) }
                  : exercise
              ),
            })),
          })),
        createNutritionDay: (date) =>
          set((state) => ({
            nutrition: {
              ...state.nutrition,
              [date]: state.nutrition[date] ?? emptyNutritionDay(date),
            },
          })),
        addMealEntry: (date) =>
          set((state) => ({
            nutrition: {
              ...state.nutrition,
              [date]: state.nutrition[date]
                ? {
                    ...state.nutrition[date],
                    meals: addItem(state.nutrition[date].meals, { id: createId('meal'), title: '' }),
                  }
                : { date, meals: [{ id: createId('meal'), title: '' }] },
            },
          })),
        updateMealEntry: (date, id, changes) =>
          set((state) => ({
            nutrition: {
              ...state.nutrition,
              [date]: state.nutrition[date]
                ? {
                    ...state.nutrition[date],
                    meals: updateById(state.nutrition[date].meals, id, changes),
                  }
                : emptyNutritionDay(date),
            },
          })),
        removeMealEntry: (date, id) =>
          set((state) => ({
            nutrition: {
              ...state.nutrition,
              [date]: state.nutrition[date]
                ? {
                    ...state.nutrition[date],
                    meals: removeById(state.nutrition[date].meals, id),
                  }
                : emptyNutritionDay(date),
            },
          })),
        createRestDay: (date) =>
          set((state) => ({
            rest: {
              ...state.rest,
              [date]: state.rest[date] ?? emptyRestDay(date),
            },
          })),
        updateRestDay: (date, changes) =>
          set((state) => ({
            rest: {
              ...state.rest,
              [date]: { ...(state.rest[date] ?? emptyRestDay(date)), ...changes },
            },
          })),
      },
    }),
    {
      name: APP_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        weeklyPlan: state.weeklyPlan,
        workouts: state.workouts,
        nutrition: state.nutrition,
        rest: state.rest,
        suggestions: state.suggestions,
      }),
    }
  )
);