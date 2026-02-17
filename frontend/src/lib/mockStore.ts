import { create } from 'zustand';

export interface Medication {
    id: number;
    name: string;
    dosage: string;
    time: string;
    color: string;
    remaining: number;
    status: 'pending' | 'taken' | 'skipped';
}

interface MockState {
    medications: Medication[];
    takeMedication: (id: number) => void;
    skipMedication: (id: number) => void;
    addMedication: (med: Omit<Medication, 'status'>) => void;
}

const initialMeds: Medication[] = [
    { id: 1, name: "Vitamin D", dosage: "1000 IU", time: "08:00 AM", color: "bg-yellow-400", remaining: 15, status: 'pending' },
    { id: 2, name: "Metformin", dosage: "500mg", time: "01:00 PM", color: "bg-white", remaining: 42, status: 'pending' },
    { id: 3, name: "Lisinopril", dosage: "10mg", time: "08:00 PM", color: "bg-pink-300", remaining: 8, status: 'pending' },
];

export const useMockStore = create<MockState>((set) => ({
    medications: initialMeds,
    takeMedication: (id) => set((state) => ({
        medications: state.medications.map((m) =>
            m.id === id ? { ...m, remaining: Math.max(0, m.remaining - 1), status: 'taken' } : m
        )
    })),
    skipMedication: (id) => set((state) => ({
        medications: state.medications.map((m) =>
            m.id === id ? { ...m, status: 'skipped' } : m
        )
    })),
    addMedication: (med) => set((state) => ({
        medications: [...state.medications, { ...med, status: 'pending' }]
    })),
}));
