import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoriesState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
  
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
  
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCategories, setLoading, setError } = categoriesSlice.actions;

export const fetchCategories = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); 

  try {
  
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories'); 
    }

    const data = await response.json(); 
    dispatch(setCategories(data));
  } catch (error) {
    dispatch(setError((error as Error).message || 'An unknown error occurred')); 
  } finally {
    dispatch(setLoading(false)); 
  }
};
export default categoriesSlice.reducer;
