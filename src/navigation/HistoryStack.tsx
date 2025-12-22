import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentHistoryScreen from '../screen/History/PaymentHistoryScreen';
import PaymentDetailScreen from '../screen/History/PaymentDetailScreen';

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ title: 'Riwayat Pembayaran' }}
      />
      <Stack.Screen
        name="PaymentDetail"
        component={PaymentDetailScreen}
        options={{ title: 'Detail Pembayaran' }}
      />
    </Stack.Navigator>
  );
}
