import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {fetchProducts} from '../store/productsSlice';
import {fetchCategories} from '../store/categoriesSlice';
import {WishlistContext} from './WishlistContext';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const products = useSelector(state => state.products.products);
  const categories = useSelector(state => state.categories.categories);
  const {wishlist, addToWishlist, removeFromWishlist} =
    useContext(WishlistContext)!;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]); 
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
      hasFetched.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const toggleWishlist = async (productId: number) => {
    wishlist.includes(productId)
      ? removeFromWishlist(productId)
      : addToWishlist(productId);

    Alert.alert(
      wishlist.includes(productId)
        ? 'Removed from Wishlist'
        : 'Added to Wishlist',
    );
  };

  const toggleCategorySelection = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category],
    );
  };

  const filterByPrice = (arr, min, max) => {
    if (arr.length === 0) return [];
    if (arr.length === 1)
      return arr[0].price >= min && arr[0].price <= max ? [arr[0]] : [];

    const mid = Math.floor(arr.length / 2);
    const left = filterByPrice(arr.slice(0, mid), min, max);
    const right = filterByPrice(arr.slice(mid), min, max);
    return [...left, ...right];
  };

  const applyFilters = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category),
      );
    }

    filtered = filterByPrice(filtered, priceRange[0], priceRange[1]);

    setFilteredProducts(filtered);
    setIsFilterModalVisible(false);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }

    const sortedProducts = [...products].sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    const filtered = sortedProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Button title="Filter" onPress={() => setIsFilterModalVisible(true)} />

      <FlatList
        data={paginatedProducts}
        renderItem={({item}) => (
          <View style={styles.productCard}>
            <Image source={{uri: item.image}} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>

            <View style={styles.buttonRow}>
              <Button
                title="View Details"
                onPress={() =>
                  navigation.navigate('ProductDetails', {product: item})
                }
              />
              <TouchableOpacity
                onPress={() => toggleWishlist(item.id)}
                style={styles.wishlistButton}>
                <Icon
                  name={wishlist.includes(item.id) ? 'heart' : 'heart-o'}
                  size={24}
                  color={wishlist.includes(item.id) ? 'red' : 'black'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.pagination}>
        <Button
          title="Previous"
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(prev => prev - 1)}
        />
        <Text>{`Page ${currentPage}`}</Text>
        <Button
          title="Next"
          disabled={currentPage * itemsPerPage >= filteredProducts.length}
          onPress={() => setCurrentPage(prev => prev + 1)}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.wishlistFloatingButton}
        onPress={() => navigation.navigate('Wishlist')}>
        <Icon name="heart" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Filter by Category</Text>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.checkboxContainer}
                  onPress={() => toggleCategorySelection(category)}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedCategories.includes(category) &&
                        styles.checkboxSelected,
                    ]}
                  />
                  <Text style={styles.categoryLabel}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Apply Filters" onPress={applyFilters} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchIcon: {marginRight: 8},
  searchInput: {flex: 1, fontSize: 16},
  productCard: {padding: 10, borderWidth: 1, marginBottom: 10},
  productImage: {width: '100%', height: 150},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#007BFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  wishlistFloatingButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: '#FF3B30',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  filterTitle: {fontSize: 18, marginBottom: 10},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxSelected: {backgroundColor: '#007BFF'},
  categoryLabel: {fontSize: 16},
});

export default ProductList;
