import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, Button, Linking } from "react-native";

interface CityScreenProps {
  city: string;
  url: string;
  color: string;
  size: number;
}

const CityScreen: React.FC<CityScreenProps> = ({ city, url, color, size }) => {
  const [selectedCity, setSelectedCity] = useState<"Calgary" | "Edmonton">("Calgary");

  // City data mapping
  const cityData = {
    Calgary: {
      image: require("../../assets/calgary.jpg"),
      url: "https://www.calgary.ca/home.html",
    },
    Edmonton: {
      image: require("../../assets/edmonton.jpg"),
      url: "https://www.edmonton.ca/",
    },
  };

  return (
    <View style={styles.container}>
      {/* Display image for the selected city */}
      <Image source={cityData[selectedCity].image} style={styles.image} />

      {/* Button to navigate to the city's webpage */}
      <View style={styles.buttonContainer}>
        <Button
          title={`Go to ${selectedCity} Page`}
          onPress={() => Linking.openURL(cityData[selectedCity].url)}
        />
      </View>

      {/* Tab buttons to switch cities */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedCity === "Calgary" && styles.selectedTab]}
          onPress={() => setSelectedCity("Calgary")}
        >
          <Text style={styles.tabText}>Calgary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedCity === "Edmonton" && styles.selectedTab]}
          onPress={() => setSelectedCity("Edmonton")}
        >
          <Text style={styles.tabText}>Edmonton</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: 350,
    height: 250,
    
    borderRadius: 10,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  tabButton: {
    // marginHorizontal: 10,
    height: 60,
    width: 200,
    paddingVertical: 12,
    paddingHorizontal: 20,
    
    marginTop:350,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTab: {
    backgroundColor: "tomato",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default CityScreen;
