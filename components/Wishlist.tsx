import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const Wishlist = () => {
  const navigation = useNavigation();
  const products = useSelector((state) => state.products.products);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('wishlist');
      if (storedWishlist) {
        const wishlistIds = JSON.parse(storedWishlist);
        setWishlist(wishlistIds);
        const filteredProducts = products.filter((product) =>
          wishlistIds.includes(product.id)
        );
        setWishlistedProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const deleteFromWishlist = async (productId: number) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this product from your wishlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const updatedWishlist = wishlist.filter((id) => id !== productId);
            setWishlist(updatedWishlist);
            setWishlistedProducts(wishlistedProducts.filter((product) => product.id !== productId));
            await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>
      <FlatList
        data={wishlistedProducts}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Button
              title="View Details"
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFromWishlist(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  productCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  productImage: { width: '100%', height: 150, marginBottom: 8 },
  productTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#555', marginBottom: 8 },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Wishlist;
