import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct, setLoading, setError } = productsSlice.actions;

export const fetchProducts = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); 

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products'); 
    }

    const data = await response.json();
    dispatch(setProducts(data)); 
  } catch (error) {
    dispatch(setError((error as Error).message || 'An unknown error occurred')); 
  } finally {
    dispatch(setLoading(false)); 
  }
};

export default productsSlice.reducer;
