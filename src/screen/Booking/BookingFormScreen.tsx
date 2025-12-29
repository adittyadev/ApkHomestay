import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authFetch } from '../../utils/authFetch';
import { IP_PUBLIC } from '../../config/IpPublic';

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
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>⏳</Text>
          <Text style={styles.loadingSubtext}>Memuat data kamar...</Text>
        </View>
      </View>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${IP_PUBLIC}/storage/${room.foto}` }}
            style={styles.roomImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title}>{room.nama_kamar}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Harga per malam</Text>
          <Text style={styles.price}>
            Rp {room.harga.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      {/* Booking Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>📅 Detail Booking</Text>

        {/* Check In */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check In</Text>
          <TouchableOpacity
            style={[styles.dateBox, checkIn && styles.dateBoxFilled]}
            activeOpacity={0.7}
            onPress={() => setShowCheckIn(true)}
          >
            <View style={styles.dateContent}>
              <Text style={styles.dateIcon}>📆</Text>
              <Text style={[styles.dateText, checkIn && styles.dateTextFilled]}>
                {checkIn
                  ? checkIn.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Pilih tanggal check in'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {showCheckIn && (
          <DateTimePicker
            value={checkIn || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setShowCheckIn(false);
              if (date) setCheckIn(date);
            }}
            minimumDate={new Date()}
          />
        )}

        {/* Check Out */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check Out</Text>
          <TouchableOpacity
            style={[styles.dateBox, checkOut && styles.dateBoxFilled]}
            activeOpacity={0.7}
            onPress={() => setShowCheckOut(true)}
          >
            <View style={styles.dateContent}>
              <Text style={styles.dateIcon}>📆</Text>
              <Text
                style={[styles.dateText, checkOut && styles.dateTextFilled]}
              >
                {checkOut
                  ? checkOut.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Pilih tanggal check out'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {showCheckOut && (
          <DateTimePicker
            value={checkOut || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setShowCheckOut(false);
              if (date) setCheckOut(date);
            }}
            minimumDate={checkIn || new Date()}
          />
        )}

        {/* Duration Info */}
        {nights > 0 && (
          <View style={styles.durationCard}>
            <Text style={styles.durationIcon}>⏱️</Text>
            <Text style={styles.durationText}>{nights} Malam</Text>
          </View>
        )}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>💰 Ringkasan Pembayaran</Text>

        {nights > 0 ? (
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Rp {room.harga.toLocaleString('id-ID')} × {nights} malam
              </Text>
              <Text style={styles.summaryValue}>
                Rp {(room.harga * nights).toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>
                Rp {calculateTotal().toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Pilih tanggal untuk melihat total pembayaran
            </Text>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={submitBooking}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {loading ? '⏳ Memproses...' : '✓ Booking Sekarang'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    fontSize: 48,
    marginBottom: 12,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  priceContainer: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  formCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  dateBoxFilled: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
  },
  dateTextFilled: {
    color: '#1f2937',
    fontWeight: '500',
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  durationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryDetails: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 32,
  },

  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
});
