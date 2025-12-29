import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { authFetch } from '../../utils/authFetch';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const loadNotifications = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await authFetch('/notifications');
      const json = await res.json();

      if (res.ok) {
        setNotifications(json.data || []);
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications(true);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await authFetch(`/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      loadNotifications(true);
    } catch (error) {
      console.log('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await authFetch('/notifications/mark-all-read', {
        method: 'POST',
      });

      if (res.ok) {
        loadNotifications(true);
      }
    } catch (error) {
      console.log('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    Alert.alert('Hapus Notifikasi', 'Yakin ingin menghapus notifikasi ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await authFetch(`/notifications/${notificationId}`, {
              method: 'DELETE',
            });
            loadNotifications(true);
          } catch (error) {
            console.log('Error deleting notification:', error);
          }
        },
      },
    ]);
  };

  const handleNotificationPress = (item: any) => {
    markAsRead(item.id);

    // Navigate based on notification type
    if (
      item.type === 'payment_confirmed' ||
      item.type === 'booking_confirmed'
    ) {
      navigation.navigate('Booking', {
        screen: 'BookingDetail',
        params: { bookingId: item.data?.booking_id },
      });
    } else if (item.type === 'review_reply') {
      // Navigate to review detail if needed
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_confirmed':
        return '💳';
      case 'payment_rejected':
        return '❌';
      case 'booking_confirmed':
        return '✅';
      case 'review_reply':
        return '💬';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Memuat notifikasi...</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🔔</Text>
        <Text style={styles.emptyTitle}>Belum Ada Notifikasi</Text>
        <Text style={styles.emptySubtitle}>
          Notifikasi Anda akan muncul di sini
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        {notifications.some(n => !n.is_read) && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllButton}>Tandai Semua Dibaca</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
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
          <TouchableOpacity
            style={[
              styles.notificationCard,
              !item.is_read && styles.unreadCard,
            ]}
            onPress={() => handleNotificationPress(item)}
            onLongPress={() => deleteNotification(item.id)}
          >
            <View style={styles.notificationContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.notificationIcon}>
                  {getNotificationIcon(item.type)}
                </Text>
                {!item.is_read && <View style={styles.unreadDot} />}
              </View>

              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.notificationTitle,
                    !item.is_read && styles.unreadTitle,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>
                  {formatDate(item.created_at)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  markAllButton: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 32,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
