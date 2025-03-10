import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import * as NavigationBar from "expo-navigation-bar";
import { Camera } from "expo-camera";
import LoadingSpinner from "@/components/LoadingSpinner";
interface LocationCoords {
  latitude: number;
  longitude: number;
}
const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // or Location.Accuracy.BestForNavigation
        timeInterval: 5000, // Optional: You can specify time interval between updates
        distanceInterval: 1, // Optional: You can specify distance interval in meter
      });
      setLocation(currentLocation.coords);
      setTimestamp(Date.now());
    })();
  }, []);
  const handleError = (e: any) => {
    console.error("WebView Error: ", e);
    setError("Error loading web page");
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
    console.log("WebView loaded successfully");
  };

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    // Hide the navigation bar
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>
          No access to the camera. Please enable permissions in settings.
        </Text>
      </View>
    );
  }
  if (!location || !timestamp) {
    return <LoadingSpinner stage="Waiting for location data"/>;
  }

  console.log(location);
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>{error}</Text>}
      <WebView
        source={{
          uri: "https://att-ems.devdolphins.com",
        }} // Use ngrok or your local IP
        injectedJavaScript={`
          (function() {
            window.ReactNativeProps = ${JSON.stringify({
              location,
              timestamp,
            })};
          })();
          true; // Required for Android
        `}
        style={styles.webview}
        onError={handleError}
        onLoad={handleLoad}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        // Enable camera access within WebView (if needed)
        originWhitelist={["*"]}
      />
      <StatusBar hidden={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default App;
