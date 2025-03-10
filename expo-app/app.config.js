import 'dotenv/config'; 
console.log('WEBVIEW_URI:', process.env.WEBVIEW_URI); // Log environment variable
export default {
  expo: {
    name: "Emp Attendance",
    slug: "emp-attendance",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/mysplash-screen.jpg",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      enableProguardInReleaseBuilds: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.empattendance",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    permissions: ["CAMERA"],
    extra: {
      WEBVIEW_URI: process.env.WEBVIEW_URI , // Use environment variable
      router: {
        origin: false,
      },
      "eas": {
        "projectId": "a0c4a499-958b-4f4d-836a-c4b8101b5acc"
      }
    },
    owner: "ramya.kasinadhuni",
  },
};