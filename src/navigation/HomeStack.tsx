import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/Home/HomeScreen';
import RoomDetailScreen from '../screen/Home/RoomDetailScreen';
import BookingFormScreen from '../screen/Booking/BookingFormScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={{ title: 'Detail Kamar' }}
      />
      <Stack.Screen
        name="BookingForm"
        component={BookingFormScreen}
        options={{ title: 'Booking Kamar' }}
      />
    </Stack.Navigator>
  );
}
