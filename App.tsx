import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Welcome" }} />
      <Tabs.Screen name="calgary" options={{ title: "Calgary" }} />
      <Tabs.Screen name="edmonton" options={{ title: "Edmonton" }} />
    </Tabs>
  );
}