import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const UserManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Doctors', 'Patients', 'Pending'];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Demo data
    const demoUsers = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@email.com',
        type: 'doctor',
        status: 'active',
        joinDate: '2024-01-15',
        specialization: 'Cardiology'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john.doe@email.com',
        type: 'patient',
        status: 'active',
        joinDate: '2024-01-10',
        age: 35
      },
      {
        id: 3,
        name: 'Dr. Mike Wilson',
        email: 'mike.wilson@email.com',
        type: 'doctor',
        status: 'pending',
        joinDate: '2024-01-20',
        specialization: 'Pediatrics'
      }
    ];
    setUsers(demoUsers);
  };

  const getFilteredUsers = () => {
    let filtered = users;

    if (selectedFilter !== 'All') {
      if (selectedFilter === 'Doctors') {
        filtered = filtered.filter(user => user.type === 'doctor');
      } else if (selectedFilter === 'Patients') {
        filtered = filtered.filter(user => user.type === 'patient');
      } else if (selectedFilter === 'Pending') {
        filtered = filtered.filter(user => user.status === 'pending');
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleUserAction = (user, action) => {
    Alert.alert(
      'User Action',
      `${action} user: ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', `User ${action.toLowerCase()}d successfully`);
            // In real app, make API call here
          }
        }
      ]
    );
  };

  const UserCard = ({ user }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{user.name.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userMeta}>
            {user.type === 'doctor' ? user.specialization : `Age: ${user.age || 'N/A'}`}
          </Text>
          <Text style={styles.joinDate}>Joined: {user.joinDate}</Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: user.status === 'active' ? '#4caf50' : '#ff9800' }
        ]}>
          <Text style={styles.statusText}>{user.status}</Text>
        </View>
        <View style={styles.actionButtons}>
          {user.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#4caf50' }]}
              onPress={() => handleUserAction(user, 'Approve')}>
              <Text style={styles.actionBtnText}>Approve</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: user.status === 'active' ? '#ff9800' : '#f44336' }]}
            onPress={() => handleUserAction(user, user.status === 'active' ? 'Suspend' : 'Reject')}>
            <Text style={styles.actionBtnText}>
              {user.status === 'active' ? 'Suspend' : 'Reject'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const filteredUsers = getFilteredUsers();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.selectedFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Users List */}
      <FlatList
        style={styles.usersList}
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserCard user={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Users Found</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === 'All' 
                ? "No users match your search criteria."
                : `No ${selectedFilter.toLowerCase()} found.`}
            </Text>
          </View>
        )}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
    </SafeAreaView>
  );
};

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
    color: '#d32f2f',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
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
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedFilter: {
    backgroundColor: '#d32f2f',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedFilterText: {
    color: 'white',
  },
  usersList: {
    flex: 1,
    padding: 20,
  },
  userCard: {
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
  userInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default UserManagementScreen;