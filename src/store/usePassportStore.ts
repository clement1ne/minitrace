import { create } from 'zustand';

type PassportStore = {
  uris: string[];
  setUris: (uris: string[]) => void;
  clearUris: () => void;
  response: any;
  setResponse: (response: any) => void;
};

export const usePassportStore = create<PassportStore>((set) => ({
  uris: [],
  setUris: (uris) => set({ uris }),
  clearUris: () => set({ uris: [] }),
  response: null,
  setResponse: (response) => set({ response }),
}));
