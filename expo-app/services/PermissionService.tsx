import { Camera } from 'expo-camera';
import * as NavigationBar from 'expo-navigation-bar';

export const PermissionService = {
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  async hideNavigationBar(): Promise<void> {
    await NavigationBar.setVisibilityAsync('hidden');
  },
};