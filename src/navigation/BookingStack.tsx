import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookingListScreen from '../screen/Booking/BookingListScreen';
import PaymentScreen from '../screen/Booking/PaymentScreen';
import UploadBuktiTransfer from '../screen/Booking/UploadBuktiTransferScreen';

export type BookingStackParamList = {
  BookingList: undefined;
  Payment: {
    booking: any;
  };
  UploadBuktiTransfer: {
    paymentId: number;
    metode: string;
    total: number;
  };
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="BookingList"
        component={BookingListScreen}
        options={{
          title: 'Booking Saya',
        }}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Pembayaran',
        }}
      />

      <Stack.Screen
        name="UploadBuktiTransfer"
        component={UploadBuktiTransfer}
        options={{
          title: 'Upload Bukti Pembayaran',
        }}
      />
    </Stack.Navigator>
  );
}
