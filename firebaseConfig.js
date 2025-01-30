import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDvUOhbG41kBwoSO2hdNy_6d73rkLniJ8",
  authDomain: "crudapp-499fd.firebaseapp.com",
  projectId: "crudapp-499fd",
  storageBucket: "crudapp-499fd.appspot.com",
  messagingSenderId: "1083596544509",
  appId: "1:1083596544509:web:408bd3b47162a4fcf72194",
  measurementId: "G-6SMZKVDSV6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add User
const addUser = async (name, phone, address) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name,
      phone,
      address,
    });
    console.log("User added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Get Users
const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
  }
};

// Update User
const updateUser = async (id, newName, newPhone, newAddress) => {
  try {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      name: newName,
      phone: newPhone,
      address: newAddress,
    });
    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// Delete User
const deleteUser = async (id) => {
  try {
    await deleteDoc(doc(db, 'users', id));
    console.log("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export { addUser, getUsers, updateUser, deleteUser };
