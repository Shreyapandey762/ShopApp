import React from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateProduct } from '../store/productsSlice';

const UpdateProduct = ({ route }: { route: any }) => {
  const { productId } = route.params;
  const product = useSelector((state: RootState) =>
    state.products.products.find(p => p.id === productId)
  );
  const dispatch = useDispatch();

  const [title, setTitle] = React.useState(product?.title || '');
  const [price, setPrice] = React.useState(product?.price.toString() || '');
  const [description, setDescription] = React.useState(product?.description || '');
  const [category, setCategory] = React.useState(product?.category || '');

  const handleSubmit = () => {
    const updatedProduct = {
      id: productId,
      title,
      price: parseFloat(price),
      description,
      category,
      image: product?.image || '',
    };

    dispatch(updateProduct(updatedProduct));
    Alert.alert('Product updated successfully');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />
      <Button title="Update Product" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 12, fontSize: 16 },
});

export default UpdateProduct;