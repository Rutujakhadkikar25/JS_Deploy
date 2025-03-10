import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LocationService, LocationCoords } from '@/services/LocationService';
import { PermissionService } from '@/services/PermissionService';
import LocationPermissionError from '@/components/LocationPermissonError';
import Constants from 'expo-constants';

const App: React.FC = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const webviewUri = Constants.expoConfig?.extra?.WEBVIEW_URI;
  const initializeLocation = async () => {
    setLoading(true);
    const result = await LocationService.requestPermissionAndGetLocation();
    
    if (result.success && result.data) {
      setLocation(result.data);
      setLocationError(null);
    } else {
      setLocationError(result.error || 'Unknown location error');
    }
    setLoading(false);
  };

  const initializeApp = async () => {
    try {
      // Request camera permissions
      const hasCameraPermission = await PermissionService.requestCameraPermission();
      
      // Hide navigation bar
      await PermissionService.hideNavigationBar();

      // Set camera permission
      setCameraPermission(hasCameraPermission);

      // Initialize location
      await initializeLocation();
    } catch (err) {
      console.error('App initialization error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  if (loading) {
    return <LoadingSpinner stage="Initializing App" />;
  }

  if (locationError) {
    return (
      <LocationPermissionError 
        onRetry={initializeLocation} 
      />
    );
  }

  if (!cameraPermission) {
    return <LocationPermissionError onRetry={initializeApp} />;
  }

  if (!location) {
    return <LoadingSpinner stage="Waiting for location" />;
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: webviewUri}}
        injectedJavaScript={`
          (function() {
            window.ReactNativeProps = ${JSON.stringify({
              location,
              timestamp: location.timestamp,
            })};
          })();
          true;
        `}
        style={styles.webview}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
      />
      <StatusBar hidden={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;