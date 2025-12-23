import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { getProfile, updateProfile } from '../../services/profileService';

export default function EditProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
  });
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      setFormData({
        nama: res.data.tamu?.nama || '',
        email: res.data.user?.email || '',
        no_hp: res.data.tamu?.no_hp || '',
        alamat: res.data.tamu?.alamat || '',
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Gagal memuat profile');
    } finally {
      setLoading(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto profil',
      [
        {
          text: 'Kamera',
          onPress: () => openCamera(),
        },
        {
          text: 'Galeri',
          onPress: () => openGallery(),
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      saveToPhotos: true,
      cameraType: 'back' as const,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      selectionLimit: 1,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', response.errorMessage || 'Gagal memilih gambar');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setSelectedImage({
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.nama ||
      !formData.email ||
      !formData.no_hp ||
      !formData.alamat
    ) {
      Alert.alert('Validasi', 'Semua field harus diisi');
      return;
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validasi', 'Format email tidak valid');
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('email', formData.email);
      data.append('no_hp', formData.no_hp);
      data.append('alamat', formData.alamat);

      if (selectedImage) {
        data.append('foto', {
          uri:
            Platform.OS === 'ios'
              ? selectedImage.uri.replace('file://', '')
              : selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.name,
        } as any);
      }

      const response = await updateProfile(data);

      if (response.success) {
        Alert.alert('Sukses', 'Profile berhasil diupdate', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const errorMessage = response.errors
          ? Object.values(response.errors).flat().join('\n')
          : 'Gagal update profile';
        Alert.alert('Error', errorMessage);
      }
    } catch (e: any) {
      console.log(e);
      Alert.alert('Error', e.message || 'Gagal update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={showImagePicker}
          style={styles.avatarContainer}
        >
          <Image
            source={{
              uri:
                selectedImage?.uri ||
                profile.tamu?.foto ||
                'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <Text style={styles.editText}>📷 Edit</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={formData.nama}
            onChangeText={text => setFormData({ ...formData, nama: text })}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            placeholder="Masukkan email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>No HP</Text>
          <TextInput
            style={styles.input}
            value={formData.no_hp}
            onChangeText={text => setFormData({ ...formData, no_hp: text })}
            placeholder="Masukkan nomor HP"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.alamat}
            onChangeText={text => setFormData({ ...formData, alamat: text })}
            placeholder="Masukkan alamat lengkap"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>💾 Simpan Perubahan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
