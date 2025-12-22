import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authFetch } from '../../utils/authFetch';

export default function BookingFormScreen({ route, navigation }: any) {
  // ✅ AMAN: params dibaca TANPA kondisi
  const room = route?.params?.room;

  // ✅ SEMUA HOOKS HARUS SELALU DIRUN
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;

    const diff =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff * room.harga : 0;
  };

  const submitBooking = async () => {
    if (!room) {
      Alert.alert('Error', 'Data kamar tidak ditemukan');
      return;
    }

    if (!checkIn || !checkOut) {
      Alert.alert('Error', 'Pilih tanggal check in & check out');
      return;
    }

    if (checkOut <= checkIn) {
      Alert.alert('Error', 'Tanggal check out harus setelah check in');
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch('/user/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: room.id,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Gagal', data.message || 'Booking gagal');
        return;
      }

      Alert.alert('Sukses', 'Booking berhasil', [
        {
          text: 'OK',
          onPress: () => {
            navigation.getParent()?.navigate('Booking');
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI fallback TANPA menghentikan hooks
  if (!room) {
    return (
      <View style={styles.center}>
        <Text>Memuat data kamar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.nama_kamar}</Text>
      <Text style={styles.price}>Harga / malam: Rp {room.harga}</Text>

      <Text style={styles.label}>Check In</Text>
      <TouchableOpacity
        style={styles.dateBox}
        activeOpacity={0.7}
        onPress={() => setShowCheckIn(true)}
      >
        <Text>
          {checkIn ? checkIn.toDateString() : 'Pilih tanggal check in'}
        </Text>
      </TouchableOpacity>

      {showCheckIn && (
        <DateTimePicker
          value={checkIn || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowCheckIn(false);
            if (date) setCheckIn(date);
          }}
        />
      )}

      <Text style={styles.label}>Check Out</Text>
      <TouchableOpacity
        style={styles.dateBox}
        activeOpacity={0.7}
        onPress={() => setShowCheckOut(true)}
      >
        <Text>
          {checkOut ? checkOut.toDateString() : 'Pilih tanggal check out'}
        </Text>
      </TouchableOpacity>

      {showCheckOut && (
        <DateTimePicker
          value={checkOut || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowCheckOut(false);
            if (date) setCheckOut(date);
          }}
        />
      )}

      <Text style={styles.total}>Total Bayar: Rp {calculateTotal()}</Text>

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#9ca3af' }]}
        onPress={submitBooking}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Memproses...' : 'Booking Sekarang'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 6,
    fontSize: 16,
  },
  label: {
    marginTop: 20,
    fontWeight: '600',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 2,
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
