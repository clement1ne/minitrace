import { create } from 'zustand';

type PassportStore = {
    uris: string[];
    setUris: (uris: string[]) => void;
    clearUris: () => void;
    response: any;
    setResponse: (response: any) => void;
    editedResponse: any;
    setEditedResponse: (editedResponse: any) => void;
    category: any;
    setCategory: (category: any) => void;
    hash: string;
    setHash: (hash: string) => void;
    blockchainTxHash: string | null;
    setBlockchainTxHash: (blockchainTxHash: string | null) => void;
    blockchainFailed: boolean;
    setBlockchainFailed: (failed: boolean) => void;
    passportId: any;
    setPassportId: (passportId: any) => void;
};

export const usePassportStore = create<PassportStore>((set) => ({
    uris: [],
    setUris: (uris) => set({ uris }),
    clearUris: () => set({ uris: [] }),
    response: null,
    setResponse: (response) => set({ response }),
    editedResponse: null,
    setEditedResponse: (editedResponse) => set({ editedResponse }),
    category: null,
    setCategory: (category) => set({ category }),
    hash: '',
    setHash: (hash) => set({ hash }),
    blockchainTxHash: null,
    setBlockchainTxHash: (blockchainTxHash) => set({ blockchainTxHash }),
    blockchainFailed: false,
    setBlockchainFailed: (blockchainFailed) => set({ blockchainFailed }),
    passportId: '',
    setPassportId: (passportId) => set({ passportId }),
}));
