import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { authFetch } from '../../utils/authFetch';

const METHODS = ['transfer', 'dana', 'ovo', 'gopay'];

export default function PaymentScreen({ route, navigation }: any) {
  const { booking } = route.params;
  const bookingId = booking.id;
  const total = booking.total_bayar;

  const [method, setMethod] = useState<string>('transfer');
  const [loading, setLoading] = useState(false);

  const submitPayment = async () => {
    setLoading(true);

    try {
      const response = await authFetch('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          metode: method,
          jumlah: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Gagal membuat pembayaran');
        return;
      }

      // 👉 PINDAH KE HALAMAN UPLOAD BUKTI
      navigation.navigate('UploadBuktiTransfer', {
        paymentId: data.data.id,
        metode: method,
        total,
      });
    } catch {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentInfo = () => {
    switch (method) {
      case 'transfer':
        return (
          <Text style={styles.infoText}>
            Transfer ke rekening:
            {'\n'}BCA 123456789
            {'\n'}a.n Tangkayo
          </Text>
        );
      case 'dana':
        return <Text style={styles.infoText}>DANA: 0812-3456-7890</Text>;
      case 'ovo':
        return <Text style={styles.infoText}>OVO: 0812-3456-7890</Text>;
      case 'gopay':
        return <Text style={styles.infoText}>GoPay: 0812-3456-7890</Text>;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pembayaran</Text>

      <View style={styles.card}>
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

      <View style={styles.infoBox}>{renderPaymentInfo()}</View>

      <TouchableOpacity
        style={styles.button}
        onPress={submitPayment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Memproses...' : 'Lakukan Pembayaran'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  total: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
  },

  methods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  methodBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  activeMethod: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },

  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
