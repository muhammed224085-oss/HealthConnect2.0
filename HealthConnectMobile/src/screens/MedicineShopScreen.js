import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { medicineAPI, orderAPI } from '../services/api';

const MedicineShopScreen = React.memo(({ navigation }) => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(['All', 'Tablets', 'Syrup', 'Capsules', 'Injections']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadMedicines();
    loadCart();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchQuery, selectedCategory, medicines]);

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
      setFilteredMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
      Alert.alert('Error', 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  const saveCart = useCallback(async (newCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      setCart(newCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, []);

  const filterMedicines = () => {
    let filtered = medicines;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(medicine => 
        medicine.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMedicines(filtered);
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...medicine, quantity: 1 }];
    }

    saveCart(newCart);
    Alert.alert('Success', `${medicine.name} added to cart`);
  };

  const removeFromCart = (medicineId) => {
    const newCart = cart.filter(item => item.id !== medicineId);
    saveCart(newCart);
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === medicineId
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const getCartQuantity = (medicineId) => {
    const cartItem = cart.find(item => item.id === medicineId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        Alert.alert('Error', 'Please login to place order');
        return;
      }

      const user = JSON.parse(userData);
      
      // Navigate to payment screen with cart data
      navigation.navigate('Payment', {
        paymentData: {
          patientId: user.id,
          type: 'MEDICINE',
          amount: getTotalAmount(),
          description: `Medicine order - ${cart.length} items`,
          orderId: 'order_' + Date.now(),
          items: cart.map(item => ({
            name: item.name,
            description: item.description || '',
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          }))
        }
      });
      
    } catch (error) {
      console.error('Error processing checkout:', error);
      Alert.alert('Error', 'Failed to process checkout');
    }
  };

  const MedicineCard = React.memo(({ medicine }) => {
    const cartQuantity = getCartQuantity(medicine.id);

    return (
      <View style={styles.medicineCard}>
        <View style={styles.medicineImage}>
          <Text style={styles.medicineIcon}>💊</Text>
        </View>
        
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineDescription} numberOfLines={2}>
            {medicine.description || 'No description available'}
          </Text>
          <Text style={styles.medicineCategory}>{medicine.category}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{medicine.price}</Text>
            <Text style={styles.stock}>Stock: {medicine.stock}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {cartQuantity > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(medicine.id, cartQuantity - 1)}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(medicine.id, cartQuantity + 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(medicine)}
              disabled={medicine.stock <= 0}>
              <Text style={styles.addButtonText}>
                {medicine.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medicine Shop</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { cart, updateQuantity, removeFromCart })}>
          <Text style={styles.cartIcon}>🛒</Text>
          {getTotalCartItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalCartItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Medicines List */}
      <FlatList
        style={styles.medicinesList}
        data={filteredMedicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMedicines} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No medicines found</Text>
            </View>
          ) : null
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => (
          {length: 120, offset: 120 * index, index}
        )}
      />

      {/* Checkout Button */}
      {cart.length > 0 && (
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.totalItems}>{getTotalCartItems()} items</Text>
            <Text style={styles.totalAmount}>₹{getTotalAmount()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#1976d2',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
  },
  medicinesList: {
    flex: 1,
    padding: 20,
  },
  medicineCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineImage: {
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineIcon: {
    fontSize: 40,
  },
  medicineInfo: {
    marginBottom: 15,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  medicineCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  stock: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#1976d2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutInfo: {
    flex: 1,
  },
  totalItems: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    padding: 50,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default MedicineShopScreen;