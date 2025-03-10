import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ErrorDisplay;