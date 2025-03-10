import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const LocationService = {
  async requestPermissionAndGetLocation(): Promise<{ 
    success: boolean, 
    data?: LocationCoords, 
    error?: string 
  }> {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return { 
          success: false, 
          error: 'Location permission denied' 
        };
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      });

      return {
        success: true,
        data: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          timestamp: Date.now(),
        }
      };
    } catch (error) {
      console.error('Location Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown location error' 
      };
    }
  },
};