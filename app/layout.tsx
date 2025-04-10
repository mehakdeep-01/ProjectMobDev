// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#3b82f6',
      tabBarLabelStyle: { fontSize: 12 },
    }}>
      <Tabs.Screen 
        name="CalendarScreen" 
        options={{ 
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Tasks" 
        options={{ 
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="RemindersScreen" 
        options={{ 
          title: "RemindersScreen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}