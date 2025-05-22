// src/redux/localStorageMiddleware.js

export const localStorageMiddleware = storeAPI => next => action => {
    const result = next(action);
  
    // Get the latest state after action is processed
    const state = storeAPI.getState();
  
    try {
      // Save only the slices you want to persist
      localStorage.setItem('auth', JSON.stringify(state.auth));
      localStorage.setItem('items', JSON.stringify(state.items));
      localStorage.setItem('otherCosts', JSON.stringify(state.otherCosts));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  
    return result;
  };
  