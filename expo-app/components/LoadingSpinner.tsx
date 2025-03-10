import React from "react"
 import { View, Text, StyleSheet, Dimensions } from "react-native"
 import { MaterialIcons } from "@expo/vector-icons"
 import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withRepeat,
   withTiming,
   withSequence,
   Easing,
 } from "react-native-reanimated"
 
 const { width } = Dimensions.get("window")
 
 const LoadingSpinner: React.FC<{ stage: string }> = ({ stage }) => {
   const rotation = useSharedValue(0)
   const scale = useSharedValue(1)
 
   React.useEffect(() => {
     rotation.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1)
     scale.value = withRepeat(
       withSequence(
         withTiming(1.2, { duration: 1000, easing: Easing.ease }),
         withTiming(1, { duration: 1000, easing: Easing.ease }),
       ),
       -1,
       true,
     )
   }, [])
 
   const animatedStyle = useAnimatedStyle(() => {
     return {
       transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
     }
   })
 
   return (
     <View style={styles.container}>
       <View style={styles.loadingBox}>
         <Animated.View style={[styles.iconContainer, animatedStyle]}>
           <MaterialIcons name="location-searching" size={48} color="#0066cc" />
         </Animated.View>
         <Text style={styles.loadingText}>Loading</Text>
         <Text style={styles.stageText}>{stage}</Text>
         <Text style={styles.subText}>Please wait while we set up your experience</Text>
       </View>
     </View>
   )
 }
 
 const styles = StyleSheet.create({
   container: {
     position: "absolute",
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: "rgba(255, 255, 255, 0.9)",
     justifyContent: "center",
     alignItems: "center",
     zIndex: 1000,
   },
   loadingBox: {
     alignItems: "center",
     justifyContent: "center",
     padding: 20,
     backgroundColor: "white",
     borderRadius: 20,
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
     width: width * 0.8,
   },
   iconContainer: {
     marginBottom: 20,
   },
   loadingText: {
     fontSize: 18,
     fontWeight: "600",
     color: "#333333",
     marginBottom: 10,
   },
   subText: {
     fontSize: 14,
     color: "#666666",
     textAlign: "center",
   },
   stageText: {
     fontSize: 16,
     fontWeight: "500",
     color: "#0066cc",
     marginBottom: 10,
   },
 })
 
 export default LoadingSpinner