import { createSlice } from '@reduxjs/toolkit';

// Helper to load otherCosts from localStorage
const loadOtherCostsFromStorage = () => {
  try {
    const serializedCosts = localStorage.getItem('otherCosts');
    if (serializedCosts === null) return [];
    return JSON.parse(serializedCosts);
  } catch (e) {
    console.error('Could not load otherCosts from localStorage', e);
    return [];
  }
};

// Helper to save otherCosts to localStorage
const saveOtherCostsToStorage = (costs) => {
  try {
    const serializedCosts = JSON.stringify(costs);
    localStorage.setItem('otherCosts', serializedCosts);
  } catch (e) {
    console.error('Could not save otherCosts to localStorage', e);
  }
};

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState: loadOtherCostsFromStorage(),
  reducers: {
    setOtherCosts: (state, action) => {
      saveOtherCostsToStorage(action.payload);
      return action.payload;
    },
    addOtherCost: (state, action) => {
      state.push(action.payload);
      saveOtherCostsToStorage(state);
    },
    updateOtherCost: (state, action) => {
      const index = state.findIndex(cost => cost.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        saveOtherCostsToStorage(state);
      }
    },
    deleteOtherCost: (state, action) => {
      const filtered = state.filter(cost => cost.id !== action.payload);
      saveOtherCostsToStorage(filtered);
      return filtered;
    },
    sortByCost: (state, action) => {
      // action.payload: 'asc' or 'desc'
      const sorted = [...state].sort((a, b) =>
        action.payload === 'asc' ? a.cost - b.cost : b.cost - a.cost
      );
      saveOtherCostsToStorage(sorted);
      return sorted;
    },
    sortByDescription: (state, action) => {
      // action.payload: 'asc' or 'desc'
      const sorted = [...state].sort((a, b) => {
        if (a.description < b.description) return action.payload === 'asc' ? -1 : 1;
        if (a.description > b.description) return action.payload === 'asc' ? 1 : -1;
        return 0;
      });
      saveOtherCostsToStorage(sorted);
      return sorted;
    },
    filterByCostThreshold: (state, action) => {
      // action.payload: { threshold: number, condition: 'above'|'below' }
      const { threshold, condition } = action.payload;
      const filtered = state.filter(cost =>
        condition === 'above' ? cost.cost > threshold : cost.cost < threshold
      );
      // Filtering is temporary; no save to localStorage here.
      return filtered;
    },
  },
});

export const {
  setOtherCosts,
  addOtherCost,
  updateOtherCost,
  deleteOtherCost,
  sortByCost,
  sortByDescription,
  filterByCostThreshold,
} = otherCostsSlice.actions;

export default otherCostsSlice.reducer;
