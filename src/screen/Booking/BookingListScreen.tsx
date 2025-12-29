  import React, { useEffect, useState, useCallback } from 'react';
  import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
  } from 'react-native';
  import { authFetch } from '../../utils/authFetch';
  import { useFocusEffect } from '@react-navigation/native';

  export default function BookingListScreen({ navigation }: any) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Auto-refresh setiap 10 detik
    useEffect(() => {
      loadBookings();

      const interval = setInterval(() => {
        loadBookings(true); // silent refresh
      }, 10000); // 10 detik

      return () => clearInterval(interval);
    }, []);

    // Refresh saat screen di-focus
    useFocusEffect(
      useCallback(() => {
        loadBookings(true);
      }, []),
    );

    const loadBookings = async (silent: boolean = false) => {
      try {
        if (!silent) setLoading(true);

        const res = await authFetch('/user/bookings');
        const json = await res.json();

        console.log('Booking data:', JSON.stringify(json.data, null, 2)); // Debug: lihat struktur data
        setBookings(json.data ?? []);
      } catch (e) {
        console.log('Error loading bookings:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    const onRefresh = () => {
      setRefreshing(true);
      loadBookings();
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return '#f59e0b';
        case 'confirmed':
          return '#10b981';
        case 'cancelled':
          return '#ef4444';
        case 'completed':
          return '#6366f1';
        default:
          return '#6b7280';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Menunggu Pembayaran';
        case 'confirmed':
          return 'Dikonfirmasi';
        case 'cancelled':
          return 'Dibatalkan';
        case 'completed':
          return 'Selesai';
        default:
          return status;
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '-';

      try {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        return date.toLocaleDateString('id-ID', options);
      } catch {
        return dateString;
      }
    };

    if (loading && bookings.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Memuat data booking...</Text>
        </View>
      );
    }

    if (bookings.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
          <Text style={styles.emptySubtitle}>
            Booking Anda akan muncul di sini
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={bookings}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              {/* Header Card */}
              <View style={styles.cardHeader}>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>
                    {item.room?.nama_kamar ?? item.nama_kamar ?? '-'}
                  </Text>
                  <Text style={styles.bookingId}>#{item.id}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(item.status_booking) + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(item.status_booking) },
                    ]}
                  >
                    {getStatusText(item.status_booking)}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Check-in & Check-out */}
              <View style={styles.dateContainer}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(
                      item.tanggal_checkin || item.checkin_date || item.check_in,
                    )}
                  </Text>
                </View>

                <View style={styles.arrowContainer}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>

                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(
                      item.tanggal_checkout ||
                        item.checkout_date ||
                        item.check_out,
                    )}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Total Payment */}
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
                <Text style={styles.totalAmount}>
                  Rp{' '}
                  {Number(
                    item.total_bayar ?? item.total_harga ?? 0,
                  ).toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Payment Button */}
              {item.status_booking === 'pending' && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Payment', {
                      booking: item,
                    })
                  }
                  style={styles.paymentButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.paymentButtonText}>💳 Bayar Sekarang</Text>
                </TouchableOpacity>
              )}

              {/* View Detail Button for other status */}
              {item.status_booking !== 'pending' && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BookingDetail', {
                      bookingId: item.id,
                    })
                  }
                  style={styles.detailButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.detailButtonText}>Lihat Detail</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f3f4f6',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f3f4f6',
    },
    loadingText: {
      fontSize: 16,
      color: '#6b7280',
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
    },
    listContainer: {
      padding: 16,
    },
    bookingCard: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    roomInfo: {
      flex: 1,
      marginRight: 12,
    },
    roomName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    bookingId: {
      fontSize: 12,
      color: '#6b7280',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 12,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateBox: {
      flex: 1,
      backgroundColor: '#f9fafb',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    dateLabel: {
      fontSize: 12,
      color: '#6b7280',
      marginBottom: 4,
      fontWeight: '500',
    },
    dateValue: {
      fontSize: 14,
      color: '#1f2937',
      fontWeight: '600',
    },
    arrowContainer: {
      paddingHorizontal: 8,
    },
    arrowIcon: {
      fontSize: 24,
      color: '#2563eb',
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    totalLabel: {
      fontSize: 14,
      color: '#6b7280',
      fontWeight: '500',
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2563eb',
    },
    paymentButton: {
      backgroundColor: '#2563eb',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 4,
    },
    paymentButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    detailButton: {
      backgroundColor: '#f3f4f6',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 4,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    detailButtonText: {
      color: '#1f2937',
      fontSize: 16,
      fontWeight: '600',
    },
  });
