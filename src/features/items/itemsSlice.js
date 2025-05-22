import { createSlice } from '@reduxjs/toolkit';

// Helper to load items from localStorage
const loadItemsFromStorage = () => {
  try {
    const serializedItems = localStorage.getItem('items');
    if (serializedItems === null) return [];
    return JSON.parse(serializedItems);
  } catch (e) {
    console.error('Could not load items from localStorage', e);
    return [];
  }
};

// Helper to save items to localStorage
const saveItemsToStorage = (items) => {
  try {
    const serializedItems = JSON.stringify(items);
    localStorage.setItem('items', serializedItems);
  } catch (e) {
    console.error('Could not save items to localStorage', e);
  }
};

const itemsSlice = createSlice({
  name: 'items',
  initialState: loadItemsFromStorage(),
  reducers: {
    setItems: (state, action) => {
      saveItemsToStorage(action.payload);
      return action.payload;
    },
    addItem: (state, action) => {
      state.push(action.payload);
      saveItemsToStorage(state);
    },
    updateItem: (state, action) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        saveItemsToStorage(state);
      }
    },
    deleteItem: (state, action) => {
      const filtered = state.filter(item => item.id !== action.payload);
      saveItemsToStorage(filtered);
      return filtered;
    },
    sortByCost: (state, action) => {
      // action.payload: 'asc' or 'desc'
      const sorted = [...state].sort((a, b) =>
        action.payload === 'asc' ? a.cost - b.cost : b.cost - a.cost
      );
      saveItemsToStorage(sorted);
      return sorted;
    },
    sortByName: (state, action) => {
      // action.payload: 'asc' or 'desc'
      const sorted = [...state].sort((a, b) => {
        if (a.name < b.name) return action.payload === 'asc' ? -1 : 1;
        if (a.name > b.name) return action.payload === 'asc' ? 1 : -1;
        return 0;
      });
      saveItemsToStorage(sorted);
      return sorted;
    },
    filterByCostThreshold: (state, action) => {
      // action.payload: { threshold: number, condition: 'above'|'below' }
      const { threshold, condition } = action.payload;
      // Filtering is view-only: do not save to storage or modify state permanently
      return state.filter(item =>
        condition === 'above' ? item.cost > threshold : item.cost < threshold
      );
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  sortByCost,
  sortByName,
  filterByCostThreshold,
} = itemsSlice.actions;

export default itemsSlice.reducer;
