import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CityScreen from '../app/screens/cityScreen';
const Tab = createBottomTabNavigator();

interface WelcomeProps {
    username: string;
    city: string;
    url: string;
    color: string;
    size: number;
}
// interface CityScreenProps {
//     city: string;
//     url: string;
//     color: string;
//     size: number;
//   }

const Welcome: React.FC<WelcomeProps> = ({username}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome {username} to my app</Text>
           
            <CityScreen city="edmonton" url="https://www.edmonton.ca/" color={''} size={0} />
            
        </View>
    );  
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Welcome;
