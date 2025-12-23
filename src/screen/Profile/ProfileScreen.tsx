import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile, logout as apiLogout } from '../../services/profileService';
import { AuthContext } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { logout } = useContext(AuthContext); // ← Ambil logout dari context
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, []),
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfile(res.data);
    } catch (e: any) {
      console.error('Error loading profile:', e);
      Alert.alert('Error', e.message || 'Gagal memuat profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: performLogout,
      },
    ]);
  };

  const performLogout = async () => {
    setLoggingOut(true);

    try {
      // Panggil API logout (hapus token di backend)
      await apiLogout();

      // Logout dari context (hapus token lokal & auto redirect ke Login)
      await logout();
    } catch (e: any) {
      console.error('Logout error:', e);

      // Tetap logout dari context meskipun API gagal
      try {
        await logout();
      } catch (logoutError) {
        console.error('Context logout error:', logoutError);
        Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
      }
    } finally {
      setLoggingOut(false);
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
    <View style={styles.container}>
      <Image
        source={{
          uri: profile?.tamu?.foto ?? 'https://via.placeholder.com/150',
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{profile?.tamu?.nama ?? 'Nama Pengguna'}</Text>
      <Text style={styles.email}>
        {profile?.user?.email ?? 'email@example.com'}
      </Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.label}>No HP</Text>
          <Text style={styles.value}>{profile?.tamu?.no_hp ?? '-'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Text style={styles.label}>Alamat</Text>
          <Text style={styles.value}>{profile?.tamu?.alamat ?? '-'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
        disabled={loggingOut}
      >
        <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#EF4444" />
        ) : (
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 16,
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRow: {
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    width: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
