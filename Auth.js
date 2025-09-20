// app/auth.js
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../firebase";

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/RoleSelect");
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Enter email and password");
    setLoading(true);
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (err) { Alert.alert("Login Error", err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert("Error", "Enter email and password");
    setLoading(true);
    try { await createUserWithEmailAndPassword(auth, email, password); }
    catch (err) { Alert.alert("Register Error", err.message); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login / Register</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <View style={styles.buttonRow}>
        <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />
        <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} />
      </View>

      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginVertical: 8, borderRadius: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
});
