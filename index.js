// app/ParentDashboard.js
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase";

export default function ParentDashboard() {
  const router = useRouter();

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth"); // Back to login screen
    } catch (err) {
      console.log("Logout Error:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍👩‍👧 Parent Dashboard</Text>

      {/* Example parent actions */}
      <Button title="View Map" onPress={() => alert("Map opened!")} />
      <View style={{ marginVertical: 10 }} />
      <Button title="View Alerts" onPress={() => alert("Showing alerts!")} />

      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    position: "absolute",
    bottom: 40,
    width: "80%",
  },
});
