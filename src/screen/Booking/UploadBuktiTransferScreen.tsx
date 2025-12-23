import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { authFetch } from '../../utils/authFetch';

export default function UploadBuktiTransfer({ route, navigation }: any) {
  const { paymentId, metode, total } = route.params;

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const pickImage = async () => {
    const ok = await requestPermission();
    if (!ok) return Alert.alert('Izin galeri ditolak');

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });
    if (result.didCancel) return;

    const asset = result.assets?.[0];
    if (!asset) return;

    setImage({
      uri: asset.uri,
      name: asset.fileName || `bukti_${Date.now()}.jpg`,
      type: asset.type || 'image/jpeg',
    });
  };

  const uploadBukti = async () => {
    if (!image) return Alert.alert('Pilih gambar terlebih dahulu');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bukti_transfer', image);

      const res = await authFetch(`/payments/${paymentId}/upload-bukti`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return Alert.alert(data.message || 'Upload gagal');

      Alert.alert('Sukses', 'Bukti pembayaran berhasil dikirim');
      navigation.navigate('BookingList');
    } catch {
      Alert.alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Bukti Pembayaran</Text>

      <Text style={styles.info}>
        Metode: {metode.toUpperCase()}
        {'\n'}Total: Rp {total}
      </Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Text>{image ? 'Ganti Gambar' : 'Pilih Gambar'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={uploadBukti}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  info: { fontSize: 14, marginBottom: 20 },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  preview: { width: '100%', height: 220, marginTop: 16, borderRadius: 12 },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
