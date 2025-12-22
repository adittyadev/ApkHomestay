import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { authFetch } from '../../utils/authFetch';

export default function BookingListScreen({ navigation }: any) {
  // 🔒 SEMUA HOOK HARUS DI ATAS
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await authFetch('/user/bookings');
      const json = await res.json();

      setBookings(json.data ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ BOLEH CONDITIONAL RENDER, TAPI TANPA HOOK
  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Tidak ada booking</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            margin: 10,
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {item.room?.nama_kamar ?? '-'}
          </Text>

          <Text>Status: {item.status_booking}</Text>
          <Text>Total: Rp {item.total_bayar}</Text>

          {item.status_booking === 'pending' && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Payment', {
                  booking: item,
                })
              }
              style={{
                marginTop: 10,
                backgroundColor: '#2563eb',
                padding: 10,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Bayar Sekarang
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}
