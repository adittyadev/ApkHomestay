import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from '../screen/Booking/PaymentScreen';
import BookingListScreen from '../screen/Booking/BookingListScreen';

const Stack = createNativeStackNavigator();

export default function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookingList"
        component={BookingListScreen}
        options={{ title: 'Booking Saya' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Pembayaran' }}
      />
    </Stack.Navigator>
  );
}
