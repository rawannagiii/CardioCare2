import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, ChevronRight, CircleUserRound, Droplets, Dumbbell, HeartPulse, House,
  Info, Lightbulb, Menu, Minus, Pill, Plus, Scale, ShieldCheck, Sparkles,
  Stethoscope, Timer, TrendingDown, UserRound, Watch, X, Zap,
} from 'lucide-react';

type Patient = { name: string; age: number; conditions: string[]; emergencyContact: string; doctor: string };
type BloodPressureReading = { id: number; systolic: number; diastolic: number; heartRate: number; recordedAt: string; note: string };
type Medication = { id: number; name: string; dose: string; frequency: string; status: 'Taken' | 'Missed' | 'Upcoming' };
type LifestyleMetrics = { steps: number; exerciseMinutes: number; weight: number; sleepHours: number; sodiumMg: number; waterGlasses: number };
type EducationCard = { title: string; summary: string; body: string; category: string };

const patient: Patient = {
  name: 'Maya Bennett', age: 58, conditions: ['Hypertension', 'Heart failure'],
  emergencyContact: 'Jordan Bennett · (415) 555-0148', doctor: 'Dr. Elena Ruiz · Cardiology',
};
const initialReadings: BloodPressureReading[] = [
  { id: 1, systolic: 126, diastolic: 78, heartRate: 72, recordedAt: '2024-06-18T08:14:00', note: 'After a quiet breakfast' },
  { id: 2, systolic: 131, diastolic: 82, heartRate: 76, recordedAt: '2024-06-17T19:42:00', note: 'Evening reading' },
  { id: 3, systolic: 124, diastolic: 76, heartRate: 70, recordedAt: '2024-06-16T08:21:00', note: 'Felt rested' },
  { id: 4, systolic: 136, diastolic: 85, heartRate: 79, recordedAt: '2024-06-15T08:03:00', note: 'Busy morning' },
  { id: 5, systolic: 129, diastolic: 80, heartRate: 74, recordedAt: '2024-06-14T19:16:00', note: '' },
];
const initialMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dose: '10 mg', frequency: 'Once each morning', status: 'Taken' },
  { id: 2, name: 'Metoprolol succinate', dose: '25 mg', frequency: 'Once each evening', status: 'Upcoming' },
  { id: 3, name: 'Furosemide', dose: '20 mg', frequency: 'Once each morning', status: 'Taken' },
];
const initialLifestyle: LifestyleMetrics = { steps: 6420, exerciseMinutes: 24, weight: 168.4, sleepHours: 7.2, sodiumMg: 1480, waterGlasses: 5 };
const educationCards: EducationCard[] = [
  { title: 'When blood pressure feels like a quiet signal', summary: 'Why steady, simple tracking matters.', body: 'High blood pressure often has no obvious symptoms. Keeping a gentle record gives you and your care team a clearer picture over time. A single reading is only one moment, not a diagnosis.', category: 'Hypertension' },
  { title: 'Your heart has a daily rhythm', summary: 'A plain-language guide to cardiovascular disease.', body: 'Cardiovascular disease describes conditions that affect the heart and blood vessels. Small routines such as taking prescribed medicines, moving regularly, and attending appointments can support heart health.', category: 'Heart health' },
  { title: 'A calmer way to check at home', summary: 'Three minutes that make a reading more useful.', body: 'Rest quietly for five minutes, place both feet on the floor, support your arm, and keep the cuff at heart level. Take two readings one minute apart and note anything that could have influenced the result.', category: 'Monitoring' },
  { title: 'Make medication easier to remember', summary: 'Build it into something you already do.', body: 'Pair your routine with a regular anchor, such as breakfast or brushing your teeth. A pill organizer or reminder can help. Never change a medication or dose without speaking with your clinician.', category: 'Medication' },
  { title: 'Less sodium, more flavor', summary: 'A realistic approach to a lower-sodium plate.', body: 'Taste food before reaching for the salt shaker. Choose fresh ingredients more often, compare labels, and use citrus, herbs, garlic, or vinegar for flavor. Your care team can help set a goal that fits you.', category: 'Nutrition' },
  { title: 'Movement that meets you where you are', summary: 'Why a few minutes still count.', body: 'Walking, chair exercises, gentle cycling, and stretching can all become part of an active day. Start at a comfortable pace and ask your care team what kinds of activity are right for you.', category: 'Movement' },
  { title: 'Know when to get urgent help', summary: 'Serious symptoms should never wait.', body: 'Call emergency services for severe chest pain or pressure, severe difficulty breathing, fainting, sudden weakness, or other serious symptoms. Do not drive yourself. CardioCare is educational and not a diagnostic tool.', category: 'Urgent signs' },
];

const navItems = [
  { href: '/', label: 'Today', icon: House },
  { href: '/blood-pressure', label: 'Blood pressure', icon: Activity },
  { href: '/medications', label: 'Medications', icon: Pill },
  { href: '/lifestyle', label: 'Lifestyle', icon: Dumbbell },
  { href: '/education', label: 'Learn', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: CircleUserRound },
];

function initials(name: string) { return name.split(' ').map((part) => part[0]).join(''); }
function formatDate(value: string) { return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function formatTime(value: string) { return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
function latest(readings: BloodPressureReading[]) { return [...readings].sort((a, b) => +new Date(b.recordedAt) - +new Date(a.recordedAt))[0]; }

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="cc-app">
      <aside className="cc-sidebar">
        <Link href="/" className="cc-brand" data-testid="link-brand"><span className="cc-brand-mark"><HeartPulse size={21} strokeWidth={2.5} /></span><span className="cc-brand-name">CardioCare</span></Link>
        <p className="cc-nav-label">Your care space</p>
        <nav className="cc-nav" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`cc-nav-link ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} /><span>{label}</span></Link>)}
        </nav>
        <div className="cc-sidebar-footer">
          <div className="cc-sidebar-note"><strong>Need urgent help?</strong>Severe chest pain, trouble breathing, or fainting? Call emergency services now.</div>
          <Link href="/profile" className="cc-profile-mini" data-testid="link-sidebar-profile"><span className="cc-avatar">{initials(patient.name)}</span><span><strong>{patient.name}</strong><small>View profile</small></span></Link>
        </div>
      </aside>
      <main className="cc-main">{children}</main>
      <nav className="cc-mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={location === href ? 'active' : ''} data-testid={`mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon /><span>{label === 'Blood pressure' ? 'BP' : label}</span></Link>)}
        <Link href="/profile" className={location === '/profile' ? 'active' : ''} data-testid="mobile-nav-profile"><UserRound /><span>Profile</span></Link>
      </nav>
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) {
  return <header className="cc-topbar"><div><span className="cc-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="cc-subtitle">{subtitle}</p></div>{action && <div className="cc-top-actions">{action}</div>}</header>;
}

function EmergencyNotice() {
  return <div className="cc-alert" data-testid="alert-emergency-guidance"><AlertTriangle size={18} /><div><strong>When symptoms feel serious, act now.</strong>For severe chest pain, severe difficulty breathing, fainting, sudden weakness, or other serious symptoms, call emergency services. Do not drive yourself. CardioCare is educational, not a diagnostic tool.</div></div>;
}

function StatCard({ label, value, unit, trend, icon: Icon, warm = false }: { label: string; value: string; unit: string; trend: string; icon: typeof Activity; warm?: boolean }) {
  return <div className="cc-card cc-stat-card" data-testid={`card-stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="cc-section-head"><span className="cc-stat-label">{label}</span><span className="cc-icon-box"><Icon size={17} /></span></div><div className="cc-stat-number">{value}<small>{unit}</small></div><span className={`cc-stat-trend ${warm ? 'warm' : ''}`}>{warm ? <ArrowUpRight size={13} /> : <TrendingDown size={13} />}{trend}</span></div>;
}

function HomePage({ readings, medications, lifestyle }: { readings: BloodPressureReading[]; medications: Medication[]; lifestyle: LifestyleMetrics }) {
  const bp = latest(readings);
  const taken = medications.filter((med) => med.status === 'Taken').length;
  const adherence = Math.round((taken / medications.length) * 100);
  return <>
    <PageHeader eyebrow="Tuesday, June 18, 2024" title={`Good morning, ${patient.name.split(' ')[0]}.`} subtitle="A few small check-ins can make today feel more in your hands." action={<Link href="/blood-pressure" className="cc-button cc-button-primary" data-testid="button-home-add-reading"><Plus size={16} /><span>Record reading</span></Link>} />
    <div className="cc-content">
      <div className="cc-grid cc-dashboard-grid">
        <section className="cc-card cc-hero-card" data-testid="card-today-overview"><span className="cc-eyebrow">Your rhythm today</span><span className="cc-time-chip"><Sparkles size={13} /> A steady start</span><h2>Care is built from the little things.</h2><p>Your latest blood pressure is in your usual range. Keep listening to your body, and take today one gentle step at a time.</p><Link href="/lifestyle" className="cc-button cc-button-soft" data-testid="button-home-lifestyle">View today's habits <ChevronRight size={15} /></Link></section>
        <StatCard label="Blood pressure" value={`${bp.systolic}/${bp.diastolic}`} unit="mmHg" trend="In your recent range" icon={Activity} />
        <StatCard label="Medication" value={`${adherence}`} unit="%" trend={`${taken} of ${medications.length} taken`} icon={Pill} />
        <div className="cc-card cc-card-pad cc-span-2"><div className="cc-section-head"><div><span className="cc-eyebrow">Today's medications</span><h2>One less thing to hold in your head.</h2></div><Link className="cc-link" href="/medications" data-testid="link-home-medications">See all</Link></div><div className="cc-list">{medications.map((med) => <div className="cc-list-row" key={med.id} data-testid={`row-home-medication-${med.id}`}><div className="cc-row-main"><span className="cc-icon-box"><Pill size={16} /></span><span><strong>{med.name}</strong><small>{med.dose} · {med.frequency}</small></span></div><span className={`cc-status ${med.status.toLowerCase()}`}>{med.status}</span></div>)}</div></div>
        <div className="cc-card cc-card-pad"><div className="cc-section-head"><div><span className="cc-eyebrow">A gentle nudge</span><h2>Keep moving at your pace.</h2></div><Dumbbell size={18} color="hsl(var(--primary))" /></div><div className="cc-stat-number">{lifestyle.steps.toLocaleString()}<small>steps</small></div><div className="cc-progress-track"><div className="cc-progress-fill coral" style={{ width: `${Math.min(lifestyle.steps / 10000 * 100, 100)}%` }} /></div><div className="cc-progress-copy"><span>Today's walk</span><span>10,000 goal</span></div><Link href="/lifestyle" className="cc-link" data-testid="link-home-lifestyle-progress">Update habits <ChevronRight size={13} /></Link></div>
        <div className="cc-card cc-card-pad cc-span-2"><div className="cc-section-head"><div><span className="cc-eyebrow">Recent signal</span><h2>Blood pressure at a glance</h2></div><Link className="cc-link" href="/blood-pressure" data-testid="link-home-bp-history">View history</Link></div><MiniChart readings={readings} /></div>
        <div className="cc-span-2"><EmergencyNotice /></div>
      </div>
    </div>
  </>;
}

function MiniChart({ readings }: { readings: BloodPressureReading[] }) {
  const points = [...readings].reverse().slice(-7);
  const width = 720; const height = 190; const padX = 40; const padY = 22;
  const x = (index: number) => padX + (index * (width - padX * 2)) / Math.max(points.length - 1, 1);
  const y = (value: number) => height - padY - ((value - 60) / 100) * (height - padY * 2);
  const systolicPath = points.map((item, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(item.systolic)}`).join(' ');
  const diastolicPath = points.map((item, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(item.diastolic)}`).join(' ');
  return <div className="cc-chart-wrap" data-testid="chart-blood-pressure"><svg className="cc-chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Blood pressure trend chart"><line x1={padX} y1={y(140)} x2={width - padX} y2={y(140)} className="cc-chart-grid" /><line x1={padX} y1={y(100)} x2={width - padX} y2={y(100)} className="cc-chart-grid" /><line x1={padX} y1={y(60)} x2={width - padX} y2={y(60)} className="cc-chart-grid" /><text x="4" y={y(140) + 4} className="cc-chart-label">140</text><text x="4" y={y(100) + 4} className="cc-chart-label">100</text><text x="10" y={y(60) + 4} className="cc-chart-label">60</text><path d={systolicPath} className="cc-chart-line" /><path d={diastolicPath} className="cc-chart-line coral" />{points.map((item, index) => <g key={item.id}><circle cx={x(index)} cy={y(item.systolic)} r="4" className="cc-chart-dot" /><text x={x(index)} y={height - 2} textAnchor="middle" className="cc-chart-label">{formatDate(item.recordedAt)}</text></g>)}</svg></div>;
}

function BloodPressurePage({ readings, onAdd }: { readings: BloodPressureReading[]; onAdd: (reading: BloodPressureReading) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'chart' | 'history'>('chart');
  const bp = latest(readings);
  return <>
    <PageHeader eyebrow="Your readings" title="Blood pressure" subtitle="A simple record helps you notice patterns without turning the day into a number." action={<button className="cc-button cc-button-primary" onClick={() => setShowForm(true)} data-testid="button-add-blood-pressure"><Plus size={16} /><span>Add reading</span></button>} />
    <div className="cc-content">
      <div className="cc-grid cc-bp-grid">
        <div className="cc-card cc-card-pad"><div className="cc-section-head"><div><span className="cc-eyebrow">Last 7 readings</span><h2>Your trend, not a verdict.</h2></div><div className="cc-pill-tabs"><button className={`cc-pill-tab ${tab === 'chart' ? 'active' : ''}`} onClick={() => setTab('chart')} data-testid="button-bp-chart-tab">Chart</button><button className={`cc-pill-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')} data-testid="button-bp-history-tab">History</button></div></div>{tab === 'chart' ? <MiniChart readings={readings} /> : <div className="cc-table-wrap"><table className="cc-table"><thead><tr><th>Date</th><th>Reading</th><th>Heart rate</th><th>Note</th></tr></thead><tbody>{readings.map((reading) => <tr key={reading.id} data-testid={`row-bp-reading-${reading.id}`}><td><strong>{formatDate(reading.recordedAt)}</strong><br /><span style={{ color: 'hsl(var(--muted-foreground))' }}>{formatTime(reading.recordedAt)}</span></td><td className="cc-mono"><strong>{reading.systolic}/{reading.diastolic}</strong> <span style={{ color: 'hsl(var(--muted-foreground))' }}>mmHg</span></td><td className="cc-mono">{reading.heartRate} bpm</td><td>{reading.note || '—'}</td></tr>)}</tbody></table></div>}</div>
        <div className="cc-card cc-card-pad"><span className="cc-eyebrow">Latest reading</span><div className="cc-stat-number" style={{ fontSize: 38, marginTop: 24 }}>{bp.systolic}<small>/ {bp.diastolic} mmHg</small></div><p className="cc-subtitle" style={{ marginTop: 10 }}>Recorded {formatDate(bp.recordedAt)} at {formatTime(bp.recordedAt)}</p><div className="cc-progress-track"><div className="cc-progress-fill" style={{ width: '76%' }} /></div><div className="cc-progress-copy"><span>Recent range</span><span>{bp.heartRate} bpm</span></div><div style={{ marginTop: 25 }}><span className="cc-status good">Looking steady</span></div></div>
      </div>
      <EmergencyNotice />
      {showForm && <BloodPressureForm onClose={() => setShowForm(false)} onAdd={(reading) => { onAdd(reading); setShowForm(false); }} />}
    </div>
  </>;
}

function BloodPressureForm({ onClose, onAdd }: { onClose: () => void; onAdd: (reading: BloodPressureReading) => void }) {
  const [form, setForm] = useState({ systolic: '', diastolic: '', heartRate: '', recordedAt: '2024-06-18T08:30', note: '' });
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.systolic || !form.diastolic || !form.heartRate) return; onAdd({ id: Date.now(), systolic: Number(form.systolic), diastolic: Number(form.diastolic), heartRate: Number(form.heartRate), recordedAt: form.recordedAt, note: form.note }); };
  return <div className="cc-modal-backdrop" role="presentation"><div className="cc-modal" role="dialog" aria-modal="true" aria-labelledby="bp-form-title"><div className="cc-modal-header"><div><span className="cc-eyebrow">New check-in</span><h2 id="bp-form-title">Record blood pressure</h2><p className="cc-subtitle">Take a seated, rested reading when you can.</p></div><button className="cc-close" onClick={onClose} aria-label="Close form" data-testid="button-close-bp-form"><X size={16} /></button></div><form onSubmit={submit}><div className="cc-form-grid"><div className="cc-field"><label htmlFor="systolic">Systolic</label><input id="systolic" className="cc-input" type="number" min="60" max="250" placeholder="120" value={form.systolic} onChange={update('systolic')} required data-testid="input-systolic" /></div><div className="cc-field"><label htmlFor="diastolic">Diastolic</label><input id="diastolic" className="cc-input" type="number" min="30" max="150" placeholder="80" value={form.diastolic} onChange={update('diastolic')} required data-testid="input-diastolic" /></div><div className="cc-field"><label htmlFor="heartRate">Heart rate</label><input id="heartRate" className="cc-input" type="number" min="30" max="220" placeholder="72" value={form.heartRate} onChange={update('heartRate')} required data-testid="input-heart-rate" /></div><div className="cc-field"><label htmlFor="recordedAt">Date and time</label><input id="recordedAt" className="cc-input" type="datetime-local" value={form.recordedAt} onChange={update('recordedAt')} data-testid="input-recorded-at" /></div><div className="cc-field full"><label htmlFor="note">Note <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>(optional)</span></label><textarea id="note" className="cc-input" placeholder="How were you feeling?" value={form.note} onChange={update('note')} data-testid="input-reading-note" /></div></div><div className="cc-form-actions"><button type="button" className="cc-button cc-button-ghost" onClick={onClose} data-testid="button-cancel-bp">Cancel</button><button className="cc-button cc-button-primary" type="submit" data-testid="button-save-bp"><Check size={15} />Save reading</button></div></form></div></div>;
}

function MedicationsPage({ medications, onUpdate, onAdd }: { medications: Medication[]; onUpdate: (id: number, status: Medication['status']) => void; onAdd: (medication: Medication) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const taken = medications.filter((med) => med.status === 'Taken').length;
  const adherence = Math.round(taken / medications.length * 100);
  return <>
    <PageHeader eyebrow="Your routine" title="Medications" subtitle="A friendly check-in for the medicines your care team has prescribed." action={<button className="cc-button cc-button-primary" onClick={() => setShowForm(true)} data-testid="button-add-medication"><Plus size={16} /><span>Add medication</span></button>} />
    <div className="cc-content"><div className="cc-grid cc-dashboard-grid" style={{ marginBottom: 18 }}><div className="cc-card cc-card-pad"><div className="cc-section-head"><div><span className="cc-eyebrow">Tuesday check-in</span><h2>How is your list going?</h2></div><Pill size={20} color="hsl(var(--primary))" /></div><div className="cc-stat-number" style={{ fontSize: 45 }}>{adherence}<small>% today</small></div><div className="cc-progress-track"><div className="cc-progress-fill" style={{ width: `${adherence}%` }} /></div><div className="cc-progress-copy"><span>{taken} of {medications.length} marked taken</span><span>{adherence >= 70 ? 'Good momentum' : 'Still time today'}</span></div></div><div className="cc-card cc-card-pad cc-span-2"><div className="cc-section-head"><div><span className="cc-eyebrow">Today</span><h2>Your medication list</h2></div><button className="cc-button cc-button-ghost" onClick={() => setShowInfo(!showInfo)} data-testid="button-medication-guidance"><Info size={15} /><span>Guidance</span></button></div>{showInfo && <div className="cc-alert" style={{ marginBottom: 12 }}><Info size={17} /><div>CardioCare does not tell you to start, stop, or change a medication or dose. Talk with your care team if something feels different.</div></div>}<div className="cc-list">{medications.map((med) => <MedicationRow key={med.id} medication={med} onUpdate={onUpdate} />)}</div></div></div><EmergencyNotice />{showForm && <MedicationForm onClose={() => setShowForm(false)} onAdd={(med) => { onAdd(med); setShowForm(false); }} />}</div>
  </>;
}

function MedicationRow({ medication, onUpdate }: { medication: Medication; onUpdate: (id: number, status: Medication['status']) => void }) {
  return <div className="cc-list-row" data-testid={`row-medication-${medication.id}`}><div className="cc-row-main"><span className="cc-icon-box"><Pill size={16} /></span><span><strong>{medication.name}</strong><small>{medication.dose} · {medication.frequency}</small></span></div><div style={{ display: 'flex', gap: 7, alignItems: 'center' }}><span className={`cc-status ${medication.status.toLowerCase()}`}>{medication.status}</span><button className="cc-button cc-button-ghost" style={{ padding: '7px 9px' }} onClick={() => onUpdate(medication.id, medication.status === 'Taken' ? 'Missed' : 'Taken')} data-testid={`button-toggle-medication-${medication.id}`}>{medication.status === 'Taken' ? 'Mark missed' : 'Mark taken'}</button></div></div>;
}

function MedicationForm({ onClose, onAdd }: { onClose: () => void; onAdd: (medication: Medication) => void }) {
  const [form, setForm] = useState({ name: '', dose: '', frequency: 'Once each morning' });
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name || !form.dose) return; onAdd({ id: Date.now(), ...form, status: 'Upcoming' }); };
  return <div className="cc-modal-backdrop"><div className="cc-modal" role="dialog" aria-modal="true" aria-labelledby="med-form-title"><div className="cc-modal-header"><div><span className="cc-eyebrow">Your care list</span><h2 id="med-form-title">Add a medication</h2><p className="cc-subtitle">Add the details exactly as written on your prescription.</p></div><button className="cc-close" onClick={onClose} aria-label="Close form" data-testid="button-close-medication-form"><X size={16} /></button></div><form onSubmit={submit}><div className="cc-form-grid"><div className="cc-field full"><label htmlFor="med-name">Medication name</label><input id="med-name" className="cc-input" placeholder="e.g. Lisinopril" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="input-medication-name" /></div><div className="cc-field"><label htmlFor="med-dose">Dose</label><input id="med-dose" className="cc-input" placeholder="e.g. 10 mg" value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} required data-testid="input-medication-dose" /></div><div className="cc-field"><label htmlFor="med-frequency">Frequency</label><select id="med-frequency" className="cc-input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} data-testid="select-medication-frequency"><option>Once each morning</option><option>Once each evening</option><option>Twice daily</option><option>As directed by care team</option></select></div></div><div className="cc-form-actions"><button type="button" className="cc-button cc-button-ghost" onClick={onClose} data-testid="button-cancel-medication">Cancel</button><button className="cc-button cc-button-primary" type="submit" data-testid="button-save-medication"><Check size={15} />Add medication</button></div></form></div></div>;
}

function LifestylePage({ lifestyle, onUpdate }: { lifestyle: LifestyleMetrics; onUpdate: (metrics: LifestyleMetrics) => void }) {
  const [draft, setDraft] = useState(lifestyle); const [saved, setSaved] = useState(false);
  const fields: { key: keyof LifestyleMetrics; label: string; unit: string; icon: typeof Activity; goal: number }[] = [
    { key: 'steps', label: 'Steps', unit: 'steps', icon: Watch, goal: 10000 }, { key: 'exerciseMinutes', label: 'Movement', unit: 'minutes', icon: Dumbbell, goal: 30 }, { key: 'weight', label: 'Weight', unit: 'lb', icon: Scale, goal: 0 }, { key: 'sleepHours', label: 'Sleep', unit: 'hours', icon: Timer, goal: 8 }, { key: 'sodiumMg', label: 'Sodium', unit: 'mg', icon: Zap, goal: 2000 }, { key: 'waterGlasses', label: 'Water', unit: 'glasses', icon: Droplets, goal: 8 },
  ];
  const update = (key: keyof LifestyleMetrics, value: string) => setDraft({ ...draft, [key]: Number(value) });
  const save = () => { onUpdate(draft); setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  return <>
    <PageHeader eyebrow="Your everyday health" title="Lifestyle" subtitle="These are guideposts, not grades. Notice what helps you feel more like yourself." action={<button className="cc-button cc-button-primary" onClick={save} data-testid="button-save-lifestyle"><Check size={16} /><span>{saved ? 'Saved' : 'Save changes'}</span></button>} />
    <div className="cc-content"><div className="cc-card cc-card-pad" style={{ marginBottom: 18 }}><div className="cc-section-head"><div><span className="cc-eyebrow">Tuesday, June 18</span><h2>Your daily guideposts</h2></div><span className="cc-status good"><ShieldCheck size={12} /> Private on this device</span></div><div className="cc-grid cc-lifestyle-grid">{fields.map(({ key, label, unit, icon: Icon, goal }) => <div className="cc-card cc-card-pad" key={key} data-testid={`card-lifestyle-${key}`}><div className="cc-section-head"><div className="cc-metric-icon"><Icon size={18} /></div><span className="cc-stat-label">{label}</span></div><div className="cc-field"><label htmlFor={`lifestyle-${key}`}>{label} <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>({unit})</span></label><input id={`lifestyle-${key}`} className="cc-input cc-mono" type="number" step={key === 'weight' || key === 'sleepHours' ? '.1' : '1'} value={draft[key]} onChange={(e) => update(key, e.target.value)} data-testid={`input-lifestyle-${key}`} /></div>{goal > 0 && <><div className="cc-progress-track"><div className={`cc-progress-fill ${key === 'sodiumMg' ? 'coral' : ''}`} style={{ width: `${Math.min(draft[key] / goal * 100, 100)}%` }} /></div><div className="cc-progress-copy"><span>{key === 'sodiumMg' ? 'under' : 'toward'} guide</span><span>{goal.toLocaleString()} {unit}</span></div></>}</div>)}</div></div><EmergencyNotice /></div>
  </>;
}

function EducationPage() {
  const [selected, setSelected] = useState<EducationCard | null>(null);
  return <>
    <PageHeader eyebrow="Small, useful reads" title="Learn at your pace." subtitle="Clear information for living with heart and blood pressure conditions. Save what feels useful for later." />
    <div className="cc-content"><div className="cc-alert" style={{ marginBottom: 18 }}><Lightbulb size={18} /><div><strong>Keep your care team in the loop.</strong>These reads are educational. They cannot diagnose symptoms or replace advice from your clinician.</div></div><div className="cc-education-grid">{educationCards.map((card, index) => <article className={`cc-card cc-education-card ${index === 0 ? 'featured' : ''}`} key={card.title} data-testid={`card-education-${index}`}><div className="cc-card-tag">{card.category}</div><h3>{card.title}</h3><p>{card.summary}</p><button className="cc-read-more" onClick={() => setSelected(card)} data-testid={`button-read-education-${index}`}>Read this guide <ChevronRight size={13} /></button></article>)}</div>{selected && <div className="cc-modal-backdrop"><div className="cc-modal" role="dialog" aria-modal="true" aria-labelledby="education-title"><div className="cc-modal-header"><div><span className="cc-eyebrow">{selected.category}</span><h2 id="education-title">{selected.title}</h2></div><button className="cc-close" onClick={() => setSelected(null)} aria-label="Close guide" data-testid="button-close-education"><X size={16} /></button></div><p className="cc-subtitle" style={{ fontSize: 14, color: 'hsl(var(--foreground))' }}>{selected.body}</p><div className="cc-form-actions"><button className="cc-button cc-button-primary" onClick={() => setSelected(null)} data-testid="button-finish-education">Done</button></div></div></div>}</div>
  </>;
}

function ProfilePage() {
  return <>
    <PageHeader eyebrow="Your care circle" title="Profile" subtitle="Keep the details here current so your care team and trusted contact have the right context." action={<button className="cc-button cc-button-ghost" onClick={() => window.alert('Profile editing is available in this prototype.')} data-testid="button-edit-profile"><UserRound size={15} /><span>Edit profile</span></button>} />
    <div className="cc-content"><div className="cc-profile-grid"><div className="cc-card cc-profile-hero"><span className="cc-avatar">{initials(patient.name)}</span><h2>{patient.name}</h2><p>Age {patient.age} · Living with {patient.conditions.join(' and ').toLowerCase()}</p><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 22 }}>{patient.conditions.map((condition) => <span className="cc-time-chip" key={condition}>{condition}</span>)}</div></div><div className="cc-card cc-card-pad"><div className="cc-section-head"><div><span className="cc-eyebrow">Patient details</span><h2>At a glance</h2></div><Stethoscope size={20} color="hsl(var(--primary))" /></div><div className="cc-detail-list"><div className="cc-detail"><span>Full name</span><strong data-testid="text-profile-name">{patient.name}</strong></div><div className="cc-detail"><span>Age</span><strong data-testid="text-profile-age">{patient.age} years</strong></div><div className="cc-detail"><span>Primary clinician</span><strong data-testid="text-profile-doctor">{patient.doctor}</strong></div><div className="cc-detail"><span>Emergency contact</span><strong data-testid="text-profile-emergency">{patient.emergencyContact}</strong></div></div></div><div className="cc-card cc-card-pad cc-span-2"><div className="cc-section-head"><div><span className="cc-eyebrow">Your care team</span><h2>Questions are welcome here.</h2></div><HeartPulse size={20} color="hsl(var(--accent))" /></div><p className="cc-subtitle">Bring your readings, medication questions, and anything that has changed in your routine to your next appointment. You never need to figure it out alone.</p><div className="cc-alert" style={{ marginTop: 20 }}><ShieldCheck size={18} /><div><strong>Privacy note</strong>This prototype keeps sample information in local React state on this device. It does not send data anywhere.</div></div></div><div className="cc-span-2"><EmergencyNotice /></div></div></div>
  </>;
}

function NotFoundPage() {
  return <div className="cc-content"><div className="cc-card cc-card-pad"><span className="cc-eyebrow">Page not found</span><h1>Let's find our way back.</h1><Link href="/" className="cc-button cc-button-primary" data-testid="link-not-found-home">Back to today</Link></div></div>;
}

function Router({ readings, onAddReading, medications, onUpdateMedication, onAddMedication, lifestyle, onUpdateLifestyle }: { readings: BloodPressureReading[]; onAddReading: (reading: BloodPressureReading) => void; medications: Medication[]; onUpdateMedication: (id: number, status: Medication['status']) => void; onAddMedication: (medication: Medication) => void; lifestyle: LifestyleMetrics; onUpdateLifestyle: (metrics: LifestyleMetrics) => void }) {
  return <AppShell><Switch><Route path="/"><HomePage readings={readings} medications={medications} lifestyle={lifestyle} /></Route><Route path="/blood-pressure"><BloodPressurePage readings={readings} onAdd={onAddReading} /></Route><Route path="/medications"><MedicationsPage medications={medications} onUpdate={onUpdateMedication} onAdd={onAddMedication} /></Route><Route path="/lifestyle"><LifestylePage lifestyle={lifestyle} onUpdate={onUpdateLifestyle} /></Route><Route path="/education"><EducationPage /></Route><Route path="/profile"><ProfilePage /></Route><Route component={NotFoundPage} /></Switch></AppShell>;
}

function App() {
  const [readings, setReadings] = useState(initialReadings);
  const [medications, setMedications] = useState(initialMedications);
  const [lifestyle, setLifestyle] = useState(initialLifestyle);
  const appProps = useMemo(() => ({ readings, onAddReading: (reading: BloodPressureReading) => setReadings((current) => [reading, ...current]), medications, onUpdateMedication: (id: number, status: Medication['status']) => setMedications((current) => current.map((med) => med.id === id ? { ...med, status } : med)), onAddMedication: (medication: Medication) => setMedications((current) => [...current, medication]), lifestyle, onUpdateLifestyle: setLifestyle }), [readings, medications, lifestyle]);
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router {...appProps} /></WouterRouter>;
}

export default App;
