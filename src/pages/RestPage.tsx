import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { getTodayISO, isValidISODate } from '../utils/date';

export default function RestPage() {
  const navigate = useNavigate();
  const params = useParams();
  const today = getTodayISO();
  const date = params.date && isValidISODate(params.date) ? params.date : today;

  const { restDay, actions } = useAppStore((state) => ({
    restDay: state.rest[date],
    actions: state.actions,
  }));

  useEffect(() => {
    if (params.date && !isValidISODate(params.date)) {
      navigate(`/rest/${today}`, { replace: true });
    }
  }, [navigate, params.date, today]);

  return (
    <div className="page">
      <section className="page-hero simple">
        <div>
          <h1>Отдых</h1>
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
                navigate(`/rest/${value}`);
              }
            }}
          />
        </div>

        {!restDay ? (
          <div className="empty-card">
            <Button variant="primary" onClick={() => actions.createRestDay(date)}>
              Создать
            </Button>
          </div>
        ) : (
          <div className="stack">
            <Input
              label="Сон, часы"
              type="text"
              inputMode="decimal"
              value={restDay.sleepHours ?? ''}
              onChange={(event) => {
                const value = event.target.value.trim();
                if (!value) {
                  actions.updateRestDay(date, { sleepHours: undefined });
                  return;
                }
                const numberValue = Number(value.replace(',', '.'));
                actions.updateRestDay(date, {
                  sleepHours: Number.isNaN(numberValue) ? undefined : Math.max(0, numberValue),
                });
              }}
            />
            <Input
              label="Заметка"
              value={restDay.note ?? ''}
              onChange={(event) => actions.updateRestDay(date, { note: event.target.value })}
            />
          </div>
        )}
      </section>
    </div>
  );
}