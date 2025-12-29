import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authFetch } from '../../utils/authFetch';
import { IP_PUBLIC } from '../../config/IpPublic';

export default function BookingDetailScreen({ route, navigation }: any) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetail();
  }, []);

  const fetchBookingDetail = async () => {
    try {
      const response = await authFetch(`/user/bookings/${bookingId}`);
      const data = await response.json();

      console.log('Full Response:', JSON.stringify(data, null, 2));

      if (response.ok) {
        // ✅ Ambil data dari array pertama, atau cari berdasarkan ID
        const bookingData = Array.isArray(data.data)
          ? data.data.find((b: any) => b.id === bookingId) || data.data[0]
          : data.data;

        setBooking(bookingData);
        console.log('Booking:', bookingData);
      } else {
        Alert.alert('Error', data.message || 'Gagal memuat detail booking');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat detail booking...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorText}>Data booking tidak ditemukan</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return '#10b981'; // hijau
      case 'checkin':
        return '#3b82f6'; // biru
      case 'checkout':
        return '#8b5cf6'; // ungu
      case 'selesai':
        return '#6b7280'; // abu-abu
      case 'cancelled':
        return '#ef4444'; // merah
      case 'pending':
      default:
        return '#f59e0b'; // kuning/orange
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'booked':
        return 'Dikonfirmasi';
      case 'checkin':
        return 'Sudah Check In';
      case 'checkout':
        return 'Sudah Check Out';
      case 'selesai':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const diff =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, diff);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header - Bukti Booking */}
      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🎫</Text>
        </View>
        <Text style={styles.headerTitle}>Bukti Booking</Text>
        <Text style={styles.bookingCode}>
          #{booking.booking_code || `BK${booking.id}`}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status_booking) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(booking.status_booking)}
          </Text>
        </View>
      </View>

      {/* Room Image */}
      <View style={styles.imageCard}>
        <Image
          source={{ uri: `${IP_PUBLIC}/storage/${booking.room?.foto}` }}
          style={styles.roomImage}
          resizeMode="cover"
        />
      </View>

      {/* Room Info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>🏨 Informasi Kamar</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama Kamar</Text>
          <Text style={styles.infoValue}>{booking.room?.nama_kamar}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipe Kamar</Text>
          <Text style={styles.infoValue}>{booking.room?.tipe_kamar}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kapasitas</Text>
          <Text style={styles.infoValue}>{booking.room?.kapasitas} Orang</Text>
        </View>
      </View>

      {/* Booking Schedule */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>📅 Jadwal Menginap</Text>

        <View style={styles.dateBox}>
          <View style={styles.dateIconContainer}>
            <Text style={styles.dateEmoji}>📆</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Check In</Text>
            <Text style={styles.dateValue}>
              {new Date(booking.check_in).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.dateBox}>
          <View style={styles.dateIconContainer}>
            <Text style={styles.dateEmoji}>📆</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Check Out</Text>
            <Text style={styles.dateValue}>
              {new Date(booking.check_out).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.durationCard}>
          <Text style={styles.durationIcon}>⏱️</Text>
          <Text style={styles.durationText}>{calculateNights()} Malam</Text>
        </View>
      </View>

      {/* Guest Info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>👤 Informasi Tamu</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama</Text>
          <Text style={styles.infoValue}>{booking.user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{booking.user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>No. Telepon</Text>
          <Text style={styles.infoValue}>{booking.tamu?.no_hp || '-'}</Text>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={styles.paymentCard}>
        <Text style={styles.sectionTitle}>💰 Rincian Pembayaran</Text>

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>
            Rp {booking.room?.harga?.toLocaleString('id-ID')} ×{' '}
            {calculateNights()} malam
          </Text>
          <Text style={styles.paymentValue}>
            Rp{' '}
            {(booking.room?.harga * calculateNights())?.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>
            Rp {booking.total_bayar?.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      {/* QR Code Placeholder - untuk scan saat check-in */}
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Tunjukkan ke Admin saat Check In</Text>
        <View style={styles.qrCodeBox}>
          <Text style={styles.qrCodeText}>QR CODE</Text>
          <Text style={styles.bookingCodeLarge}>
            {booking.booking_code || `BK${booking.id}`}
          </Text>
        </View>
        <Text style={styles.qrNote}>
          Screenshot halaman ini sebagai bukti booking
        </Text>
      </View>

      {/* Footer Note */}
      <View style={styles.footerNote}>
        <Text style={styles.footerIcon}>ℹ️</Text>
        <Text style={styles.footerText}>
          Harap tiba 30 menit sebelum waktu check-in untuk verifikasi
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  headerSection: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bookingCode: {
    fontSize: 18,
    color: '#dbeafe',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imageCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roomImage: {
    width: '100%',
    height: 200,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateEmoji: {
    fontSize: 24,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
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
  paymentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  qrCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrCodeBox: {
    width: 200,
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  qrCodeText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  bookingCodeLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  qrNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  footerNote: {
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
  },
  bottomSpacing: {
    height: 32,
  },
});
