import { Slot } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { auth } from "../firebase";
import AuthScreen from "./AuthScreen";

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <View style={{ padding: 16 }}>
        <Button title="Logout" onPress={() => signOut(auth)} />
      </View>
    </View>
  );
}
