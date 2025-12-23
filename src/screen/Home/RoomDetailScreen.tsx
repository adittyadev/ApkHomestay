import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { IP_PUBLIC } from '../../config/IpPublic';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function RoomDetailScreen({ route, navigation }: any) {
  const { room } = route.params;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    if (status.toLowerCase() === 'available') {
      return {
        color: '#10B981',
        bgColor: '#D1FAE5',
        text: 'Tersedia',
        icon: 'checkmark-circle',
      };
    }
    return {
      color: '#9CA3AF',
      bgColor: '#F3F4F6',
      text: 'Tidak Tersedia',
      icon: 'close-circle',
    };
  };

  const statusInfo = getStatusInfo(room.status);
  const isBooked = room.status.toLowerCase() === 'booked';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {room.foto ? (
            <Image
              source={{ uri: `${IP_PUBLIC}/storage/${room.foto}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={80} color="#9CA3AF" />
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.bgColor },
            ]}
          >
            <Ionicons
              name={statusInfo.icon}
              size={16}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Room Name */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.roomName}>{room.nama_kamar}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="people" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.infoLabel}>Kapasitas</Text>
              <Text style={styles.infoValue}>{room.kapasitas} Orang</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="bed" size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Tipe</Text>
              <Text style={styles.infoValue}>Standar</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="resize" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.infoLabel}>Ukuran</Text>
              <Text style={styles.infoValue}>25 m²</Text>
            </View>
          </View>

          {/* Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fasilitas Kamar</Text>
            <View style={styles.facilitiesContainer}>
              <View style={styles.facilityItem}>
                <Ionicons name="wifi" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>WiFi Gratis</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="tv" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>TV LED</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="snow" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>AC</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="water" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>Kamar Mandi</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="restaurant" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>Sarapan</Text>
              </View>
              <View style={styles.facilityItem}>
                <Ionicons name="car" size={20} color="#6B7280" />
                <Text style={styles.facilityText}>Parkir</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>
              Kamar yang nyaman dan bersih dengan fasilitas lengkap. Cocok untuk
              liburan keluarga atau perjalanan bisnis. Lokasi strategis dengan
              akses mudah ke berbagai tempat wisata dan pusat kota.
            </Text>
          </View>

          {/* Spacer for bottom button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar - Price & Booking Button */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Harga per Malam</Text>
          <Text style={styles.price}>{formatPrice(room.harga)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('BookingForm', { room })}
          style={[styles.bookButton, isBooked && styles.bookButtonDisabled]}
          disabled={isBooked}
        >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.bookButtonText}>
            {isBooked ? 'Tidak Tersedia' : 'Booking Sekarang'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusBadge: {
    position: 'absolute',
    top: 40,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerSection: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  facilityText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});
