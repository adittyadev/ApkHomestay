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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/IpPublic';
// react-native-blob-util provides a reliable native upload for Android/iOS
// @ts-ignore
import RNFetchBlob from 'react-native-blob-util';

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
      console.log('[uploadBukti] image', image);
      // Use react-native-blob-util to upload the file natively.
      // This handles content:// URIs on Android and avoids fetch multipart issues.
      const token = await AsyncStorage.getItem('token');
      const fullUrl = `${API_URL}/payments/${paymentId}/upload-bukti`;

      // Prepare multipart data array
      const multipart = [
        {
          name: 'bukti_transfer',
          filename: image.name || `bukti_${Date.now()}.jpg`,
          type: image.type || 'image/jpeg',
          // RNFetchBlob.wrap handles file:// and content:// URIs
          data: RNFetchBlob.wrap(image.uri),
        },
      ];

      const res = await RNFetchBlob.fetch(
        'POST',
        fullUrl,
        {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // let native lib set Content-Type multipart boundary
        },
        multipart as any,
      );

      console.log('[uploadBukti] rnfetchblob info', res.info && res.info());

      const status = res.info ? res.info().status : res.respInfo && res.respInfo.status;
      let data: any = null;
      try {
        data = res.data ? JSON.parse(res.data) : null;
      } catch (e) {
        // ignore parse error
      }

      if (!status || status < 200 || status >= 300) {
        const msg = (data && data.message) || `Upload gagal (status ${status})`;
        return Alert.alert('Error', msg);
      }

      Alert.alert('Sukses', 'Bukti pembayaran berhasil dikirim');
      navigation.navigate('BookingList');
    } catch (err: any) {
      // show error details to help debugging
      const errMsg = (err && err.message) || 'Network error';
      console.error('Upload error', errMsg, err);
      Alert.alert('Network error', errMsg as string);
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
