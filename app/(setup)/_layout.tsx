import React from 'react';
import { Stack } from 'expo-router';

export default function SetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcomeTab" />
      <Stack.Screen name="setupTab" />
    </Stack>
  );
}
