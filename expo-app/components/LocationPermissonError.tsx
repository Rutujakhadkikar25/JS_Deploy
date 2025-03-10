import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationPermissionErrorProps {
  onRetry: () => void;
}

const LocationPermissionError: React.FC<LocationPermissionErrorProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.errorBox}>
        <MaterialIcons 
          name="location-off" 
          size={64} 
          color="#ff6b6b" 
          style={styles.icon}
        />
        <Text style={styles.errorTitle}>Oops! Location Permission Denied</Text>
        <Text style={styles.errorMessage}>
          We need your location to provide the best experience. 
          Please allow location access to continue.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>
            Allow Location Access
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  errorBox: {
    width: width * 0.85,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationPermissionError;