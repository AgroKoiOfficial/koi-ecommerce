// useCheckoutStore.ts
import { create } from 'zustand';

const useCheckoutStore = create((set) => ({
  checkouts: [],
  currentPage: 1,
  itemsPerPage: 10,
  setCheckouts: (checkouts) => set({ checkouts }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default useCheckoutStore;
