import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Card',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💳</Text>,
        }}
      />
    </Tabs>
  );
}
