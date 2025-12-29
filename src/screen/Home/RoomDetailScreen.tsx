import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { IP_PUBLIC } from '../../config/IpPublic';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function RoomDetailScreen({ route, navigation }: any) {
  const { room } = route.params;

  /* ================= STATE ================= */
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= FORMAT ================= */
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

  /* ================= API ================= */
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${IP_PUBLIC}/api/rooms/${room.id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.log(e);
    }
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      Alert.alert('Validasi', 'Rating dan komentar wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      await fetch(`${IP_PUBLIC}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: room.id,
          rating,
          comment,
        }),
      });

      setRating(0);
      setComment('');
      fetchReviews();
    } catch {
      Alert.alert('Error', 'Gagal mengirim komentar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= RENDER ================= */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <View style={styles.imageContainer}>
          {room.foto ? (
            <Image
              source={{ uri: `${IP_PUBLIC}/storage/${room.foto}` }}
              style={styles.image}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={80} color="#9CA3AF" />
            </View>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

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

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          <Text style={styles.roomName}>{room.nama_kamar}</Text>

          {/* INFO */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="people" size={20} color="#3B82F6" />
              <Text>{room.kapasitas} Orang</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="bed" size={20} color="#10B981" />
              <Text>Standar</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="resize" size={20} color="#F59E0B" />
              <Text>25 m²</Text>
            </View>
          </View>

          {/* KOMENTAR INPUT */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beri Ulasan</Text>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Ionicons
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Tulis komentar..."
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              multiline
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={submitReview}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Kirim Komentar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* LIST KOMENTAR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ulasan Pengunjung</Text>

            {reviews.length === 0 && (
              <Text style={{ color: '#6B7280' }}>Belum ada komentar</Text>
            )}

            {reviews.map(item => (
              <View key={item.id} style={styles.reviewCard}>
                <Text style={styles.reviewUser}>{item.user.name}</Text>

                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons
                      key={i}
                      name={i <= item.rating ? 'star' : 'star-outline'}
                      size={16}
                      color="#F59E0B"
                    />
                  ))}
                </View>

                <Text style={styles.reviewText}>{item.comment}</Text>

                {item.replies.map((r: any) => (
                  <View key={r.id} style={styles.replyBox}>
                    <Text style={styles.replyUser}>{r.user.name}</Text>
                    <Text>{r.reply}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>{formatPrice(room.harga)}</Text>
        <TouchableOpacity
          disabled={isBooked}
          style={[styles.bookButton, isBooked && styles.bookButtonDisabled]}
          onPress={() => navigation.navigate('BookingForm', { room })}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
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

  /* ================= REVIEW ================= */
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  reviewText: {
    marginTop: 6,
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
  },

  replyBox: {
    marginTop: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginLeft: 12,
  },
  replyUser: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sendButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
