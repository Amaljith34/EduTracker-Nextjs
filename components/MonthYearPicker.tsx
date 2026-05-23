'use client';

interface Props {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getYearOptions() {
  const current = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => current - i);
}

export default function MonthYearPicker({ month, year, onChange }: Props) {
  return (
    <>
      <div className="mypicker">
        <select
          value={month}
          onChange={(e) => onChange(Number(e.target.value), year)}
          className="mypicker-select"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onChange(month, Number(e.target.value))}
          className="mypicker-select"
        >
          {getYearOptions().map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <style suppressHydrationWarning>{`
        .mypicker{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;}
        .mypicker-select{border:1.5px solid #1f2937;border-radius:10px;background:#111827;padding:.55rem .75rem;font-size:.85rem;color:#e5e7eb;outline:none;cursor:pointer;transition:border-color .15s,box-shadow .15s;min-width:0;}
        .mypicker-select:focus{border-color:#00d4a4;box-shadow:0 0 0 3px rgba(0,212,164,.1);}
        @media(max-width:400px){
          .mypicker{gap:.35rem;}
          .mypicker-select{padding:.5rem .6rem;font-size:.8rem;}
        }
      `}</style>
    </>
  );
}