import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { authFetch } from '../../utils/authFetch';
import { IP_PUBLIC } from '../../config/IpPublic';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

type Room = {
  id: number;
  nama_kamar: string;
  kapasitas: number;
  harga: number;
  status: string;
  foto: string | null;
};

export default function HomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load rooms saat pertama kali
  useEffect(() => {
    getRooms();
  }, []);

  // Filter rooms saat search query atau rooms berubah
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room =>
        room.nama_kamar.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredRooms(filtered);
    }
  }, [searchQuery, rooms]);

  const getRooms = async () => {
    try {
      const response = await authFetch('/rooms');
      console.log('STATUS:', response.status);

      const data = await response.json();
      console.log('ROOM RESPONSE:', data);

      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.log('ERROR GET ROOMS:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          badge: styles.statusAvailable,
          text: 'Tersedia',
          icon: 'checkmark-circle',
        };
      case 'booked':
        return {
          badge: styles.statusBooked,
          text: 'Tidak Tersedia',
          icon: 'close-circle',
        };
      default:
        return {
          badge: styles.statusAvailable,
          text: 'Tersedia',
          icon: 'close-circle',
        };
    }
  };

  const renderRoomCard = ({ item }: { item: Room }) => {
    const statusInfo = getStatusStyle(item.status);
    const isBooked = item.status.toLowerCase() === 'booked';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('RoomDetail', { room: item })}
        style={[styles.card, isBooked && styles.cardDisabled]}
        activeOpacity={0.9}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          {item.foto ? (
            <Image
              source={{ uri: `${IP_PUBLIC}/storage/${item.foto}` }}
              style={[styles.image, isBooked && styles.imageDisabled]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.placeholderImage,
                isBooked && styles.imageDisabled,
              ]}
            >
              <Ionicons name="image-outline" size={50} color="#9CA3AF" />
            </View>
          )}

          {/* Overlay for booked rooms */}
          {isBooked && <View style={styles.imageOverlay} />}

          {/* Status Badge */}
          <View style={[styles.statusBadge, statusInfo.badge]}>
            <Ionicons name={statusInfo.icon} size={14} color="#fff" />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text
            style={[styles.roomName, isBooked && styles.textDisabled]}
            numberOfLines={1}
          >
            {item.nama_kamar}
          </Text>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons
                name="people-outline"
                size={16}
                color={isBooked ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[styles.infoText, isBooked && styles.textDisabled]}>
                {item.kapasitas} Orang
              </Text>
            </View>
          </View>

          {/* Price & Button */}
          <View style={styles.footer}>
            <View>
              <Text
                style={[styles.priceLabel, isBooked && styles.textDisabled]}
              >
                Harga per Malam
              </Text>
              <Text style={[styles.price, isBooked && styles.priceDisabled]}>
                {formatPrice(item.harga)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.detailButton,
                isBooked && styles.detailButtonDisabled,
              ]}
              onPress={() => navigation.navigate('RoomDetail', { room: item })}
            >
              <Text style={styles.detailButtonText}>Detail</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyText}>
        {searchQuery ? 'Kamar tidak ditemukan' : 'Tidak ada kamar tersedia'}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Coba kata kunci lain' : 'Silakan coba lagi nanti'}
      </Text>
    </View>
  );

  // Loading state - HARUS di paling atas setelah semua hooks
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Memuat kamar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Selamat Datang, {user?.name || 'Pengguna'}! 👋
          </Text>
          <Text style={styles.subtitle}>Temukan kamar terbaik untuk Anda</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kamar..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Room Count & Filter */}
      <View style={styles.countContainer}>
        <View style={styles.countLeft}>
          <Ionicons name="bed-outline" size={20} color="#3B82F6" />
          <Text style={styles.countText}>
            {filteredRooms.length} Kamar Ditemukan
          </Text>
        </View>
        <View style={styles.statusIndicators}>
          <View style={styles.miniStatus}>
            <View style={[styles.miniDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.miniText}>Tersedia</Text>
          </View>
          <View style={styles.miniStatus}>
            <View style={[styles.miniDot, { backgroundColor: '#9CA3AF' }]} />
            <Text style={styles.miniText}>Tidak Tersedia</Text>
          </View>
        </View>
      </View>

      {/* Room List */}
      <FlatList
        data={filteredRooms}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderRoomCard}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  countLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  miniText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDisabled: {
    opacity: 0.5,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: '#10B981',
  },
  statusBooked: {
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  priceDisabled: {
    color: '#9CA3AF',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
