// app/_layout.tsx
// app/_layout.tsx
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="calendar" options={{ title: "CalendarScreen" }} />
      <Tabs.Screen name="tasks" options={{ title: "TasksScreen" }} />
      <Tabs.Screen name="reminders" options={{ title: "RemindersScreen" }} />
    </Tabs>
  );
}



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import CalendarScreen from './app/screens/CalendarScreen';
// import TasksScreen from './app/screens/TasksScreen';
// import RemindersScreen from './app/screens/RemindersScreen';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
      
//         <Tab.Screen name="Calendar" component={CalendarScreen} />
//         <Tab.Screen name="Tasks" component={TasksScreen} />
//         <Tab.Screen name="Reminders" component={RemindersScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }