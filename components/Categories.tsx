import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategories } from '../utils/api';
import { RootState } from '../store';
import { setCategories } from '../store/categoriesSlice';

const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(data => {
        dispatch(setCategories(data));
        setLoading(false);
      })
      .catch(console.error);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.categoryItem}>{item}</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryItem: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Categories;