import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RoleSelect() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      <View style={styles.button}>
        <Button title="👨 Parent" onPress={() => router.replace("/ParentDashboard")} />
      </View>
      <View style={styles.button}>
        <Button title="👧 Child" onPress={() => router.replace("/ChildHome")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 30, fontWeight: "bold" },
  button: { marginVertical: 10, width: "80%" },
});
