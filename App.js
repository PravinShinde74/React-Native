import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { addUser, getUsers, updateUser, deleteUser } from "./firebaseConfig"; // Import Firebase functions

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userList, setUserList] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user ID for update

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const users = await getUsers();
    setUserList(users);
  };

  // Handle Add User
  const handleAddUser = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      await addUser(name, phone, address);
      Alert.alert("Success", "User added successfully!");
      setName("");
      setPhone("");
      setAddress("");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error in adding user:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Handle Update User (via text inputs)
  const handleUpdateUser = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      await updateUser(currentUserId, name, phone, address);
      Alert.alert("Success", "User updated successfully!");
      setIsEditing(false); // Exit editing mode
      fetchUsers(); // Refresh the user list
      setName("");
      setPhone("");
      setAddress("");
    } catch (error) {
      console.error("Error in updating user:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      Alert.alert("Success", "User deleted successfully!");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error in deleting user:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // View User Details
  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  // Render user item
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>{item.name}</Text>
      <Text style={styles.userText}>{item.phone}</Text>
      <Text style={styles.userText}>{item.address}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            setIsEditing(true);
            setCurrentUserId(item.id); // Store user ID for update
            setName(item.name);
            setPhone(item.phone);
            setAddress(item.address);
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewUser(item)}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button title={isEditing ? "Update User" : "Add User"} onPress={isEditing ? handleUpdateUser : handleAddUser} />

      {viewingUser ? (
        <View style={styles.viewUserContainer}>
          <Text style={styles.viewUserTitle}>User Details</Text>
          <Text>Name: {viewingUser.name}</Text>
          <Text>Phone: {viewingUser.phone}</Text>
          <Text>Address: {viewingUser.address}</Text>
          <Button title="Close" onPress={() => setViewingUser(null)} />
        </View>
      ) : (
        <FlatList
          data={userList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.userList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2", // Light background color
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff", // Light background for input fields
  },
  userList: {
    marginTop: 20,
  },
  userItem: {
    backgroundColor: "#e6f7ff", // Light blue background
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#66bb6a", // Light green for update
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#ff7043", // Light red for delete
    padding: 8,
    borderRadius: 5,
  },
  viewButton: {
    backgroundColor: "#42a5f5", // Light blue for view
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  viewUserContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#e6ffe6", // Light green for view user details
    borderRadius: 5,
  },
  viewUserTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
