import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import AddProduct from './components/AddProducts';
import UpdateProduct from './components/UpdateProduct';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Product List' }} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
          <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'Add Product' }} />
          <Stack.Screen name="UpdateProduct" component={UpdateProduct} options={{ title: 'Update Product' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;