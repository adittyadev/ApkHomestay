import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { authFetch } from '../../utils/authFetch';

const METHODS = ['transfer', 'dana', 'ovo', 'gopay'];

export default function PaymentScreen({ route, navigation }: any) {
  const { booking } = route.params;
  const bookingId = booking.id;
  const total = booking.total_bayar;

  const [method, setMethod] = useState<string>('transfer');
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Gagal pilih gambar');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];

          if (!asset.uri) {
            Alert.alert('Error', 'URI gambar tidak ditemukan');
            return;
          }

          setImage({
            uri: asset.uri, // ⬅️ BIARKAN ASLI
            name: asset.fileName || `bukti_${Date.now()}.jpg`,
            type: asset.type || 'image/jpeg',
          });
        }
      },
    );
  };

  const submitPayment = async () => {
    if (!image) {
      Alert.alert('Error', 'Upload bukti pembayaran');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('booking_id', bookingId.toString());
      formData.append('metode', method);
      formData.append('jumlah', total.toString());
      formData.append('bukti_transfer', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);

      console.log('UPLOAD DATA:', {
        booking_id: bookingId,
        metode: method,
        jumlah: total,
        file: image,
      });

      const response = await authFetch('/payments', {
        method: 'POST',
        body: formData,
      });

      const status = response.status;
      const text = await response.text();

      console.log('PAYMENT STATUS:', status);
      console.log('PAYMENT RESPONSE:', text);

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        Alert.alert(`Gagal (${status})`, data.message || 'Pembayaran gagal');
        return;
      }

      Alert.alert('Sukses', 'Pembayaran berhasil dikirim', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Booking'),
        },
      ]);
    } catch (error: any) {
      console.log('PAYMENT JS ERROR:', error);
      Alert.alert('Error JS', error.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pembayaran</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Kamar</Text>
        <Text style={styles.value}>{booking.room?.nama_kamar ?? '-'}</Text>

        <Text style={styles.label}>Total Bayar</Text>
        <Text style={styles.total}>Rp {total}</Text>
      </View>

      <Text style={styles.label}>Metode Pembayaran</Text>
      <View style={styles.methods}>
        {METHODS.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.methodBtn, method === item && styles.activeMethod]}
            onPress={() => setMethod(item)}
          >
            <Text style={{ color: method === item ? '#fff' : '#000' }}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.upload} onPress={pickImage}>
        <Text>
          {image ? 'Ganti Bukti Pembayaran' : 'Upload Bukti Pembayaran'}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <TouchableOpacity
        style={styles.button}
        onPress={submitPayment}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {loading ? 'Mengirim...' : 'Kirim Pembayaran'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
  methods: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  methodBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  activeMethod: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  upload: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
  },
});
