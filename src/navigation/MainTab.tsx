import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import BookingStack from './BookingStack';
import NotificationScreen from '../screen/Notification/NotificationScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Booking') iconName = 'bed';
          if (route.name === 'Notification') iconName = 'time';
          if (route.name === 'Profil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Booking" component={BookingStack} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Profil" component={ProfileStack} />
    </Tab.Navigator>
  );
}
