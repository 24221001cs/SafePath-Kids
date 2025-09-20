// screens/ChatMonitor.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { auth, db } from "../firebase";

const banned = ["stupid", "kill", "idiot", "hate"]; // demo list

export default function ChatMonitor({ userMeta }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    const msgDoc = {
      userId: auth.currentUser.uid,
      familyCode: userMeta.familyCode,
      text: message,
      ts: serverTimestamp(),
    };
    await addDoc(collection(db, "chats"), msgDoc);

    const lower = message.toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      await addDoc(collection(db, "alerts"), {
        type: "chat-risk",
        text: message,
        userId: auth.currentUser.uid,
        name: userMeta.name,
        familyCode: userMeta.familyCode,
        ts: serverTimestamp(),
      });
      Alert.alert("Warning", "This message triggered a chat alert.");
    } else {
      Alert.alert("Sent", "Message saved (no risk detected).");
    }

    setMessage("");
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Type a message (child)" value={message} onChangeText={setMessage} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Send message" onPress={sendMessage} />
    </View>
  );
}
