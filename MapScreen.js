// screens/MapScreen.js
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../firebase";

function parseCoords(coords) {
  if (!coords) return null;
  // common shapes: { latitude, longitude } or Firestore GeoPoint { latitude, longitude }
  if (typeof coords.latitude === "number" && typeof coords.longitude === "number") {
    return { latitude: coords.latitude, longitude: coords.longitude };
  }
  // fallback checks (lat/lng)
  if (typeof coords.lat === "number" && typeof coords.lng === "number") {
    return { latitude: coords.lat, longitude: coords.lng };
  }
  // unknown format
  return null;
}

function parseTimestamp(ts) {
  if (!ts) return null;
  // Firestore Timestamp object has toDate()
  if (typeof ts.toDate === "function") return ts.toDate();
  // already a Date
  if (ts instanceof Date) return ts;
  return null;
}

export default function MapScreen({ userMeta }) {
  const [markers, setMarkers] = useState([]); // array of { id, name, coords, tsDate }
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!userMeta || !userMeta.familyCode) {
      setMarkers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "latestLocations"),
      where("familyCode", "==", userMeta.familyCode)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data();
          const coordsParsed = parseCoords(data.coords);
          const tsDate = parseTimestamp(data.ts);
          return {
            id: d.id,
            name: data.name || "Unknown",
            coords: coordsParsed, // null if unparsable
            tsDate, // Date or null
          };
        }).filter(item => item.coords !== null); // ignore documents without valid coords

        setMarkers(docs);
        setLoading(false);
      },
      (error) => {
        console.warn("Map onSnapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userMeta?.familyCode]);

  // animate map to first marker (or latest)
  useEffect(() => {
    if (markers.length > 0 && mapRef.current) {
      const target = markers[0].coords;
      mapRef.current.animateToRegion(
        {
          latitude: target.latitude,
          longitude: target.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500 // duration ms
      );
    }
  }, [markers]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userMeta || !userMeta.familyCode) {
    return (
      <View style={styles.center}>
        <Text>No family selected (missing userMeta.familyCode)</Text>
      </View>
    );
  }

  const fallbackRegion = {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const initialRegion = markers.length
    ? {
        latitude: markers[0].coords.latitude,
        longitude: markers[0].coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : fallbackRegion;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.coords.latitude, longitude: m.coords.longitude }}
            title={m.name}
            description={m.tsDate ? m.tsDate.toLocaleString() : ""}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
