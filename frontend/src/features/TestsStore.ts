import { create } from 'zustand';

type Answer = {
  questionId: number;
  variantId: number;
};

type TestStore = {
  isOpen: boolean;
  testId: number | null;
  onComplete: ((answers: Answer[]) => void) | null;
  openTest: (testId: number, onComplete?: (answers: Answer[]) => void) => void;
  closeTest: () => void;
};

export const useTestStore = create<TestStore>((set) => ({
  isOpen: false,
  testId: null,
  onComplete: null,
  openTest: (testId, onComplete) => set({ isOpen: true, testId, onComplete }),
  closeTest: () => set({ isOpen: false, testId: null, onComplete: null }),
}));