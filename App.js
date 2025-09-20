// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

import AuthScreen from "./screens/AuthScreen";
import ChildHome from "./screens/ChildHome"; // create this file
import MapScreen from "./screens/MapScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userMeta, setUserMeta] = useState({ familyCode: "abc123" }); // temporary test

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Step 1: Auth */}
        {!user ? (
          <Stack.Screen name="Auth" options={{ headerShown: false }}>
            {(props) => (
              <AuthScreen
                {...props}
                onAuthSuccess={() => setUser(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            {/* Step 2: Choose role */}
            <Stack.Screen name="RoleSelect" options={{ headerShown: false }}>
              {(props) => (
                <RoleSelectScreen {...props} setUserMeta={setUserMeta} />
              )}
            </Stack.Screen>

            {/* Step 3: Parent and Child dashboards */}
            <Stack.Screen name="ParentDashboard" options={{ title: "Parent Dashboard" }}>
              {(props) => <MapScreen {...props} userMeta={userMeta} />}
            </Stack.Screen>
            <Stack.Screen name="ChildHome" component={ChildHome} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
