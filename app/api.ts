const BASE = 'http://10.0.2.2:3000'; // For Android emulator

export const fetchTasks = async () => (await fetch(`${BASE}/tasks`)).json();
export const addTask = async (task: any) => await fetch(`${BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) });
export const deleteTask = async (id: number) => await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });

export const fetchReminders = async () => (await fetch(`${BASE}/reminders`)).json();
export const addReminder = async (reminder: any) => await fetch(`${BASE}/reminders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reminder) });

export const fetchImportantDates = async () => (await fetch(`${BASE}/important-dates`)).json();