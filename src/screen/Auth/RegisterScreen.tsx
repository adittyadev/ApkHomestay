import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { register } from '../../services/authService';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.no_hp.trim()) {
      newErrors.no_hp = 'Nomor HP harus diisi';
    } else if (!/^[0-9]{10,15}$/.test(formData.no_hp)) {
      newErrors.no_hp = 'Nomor HP tidak valid (10-15 digit)';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat harus diisi';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('Starting registration...');
      const response = await register(formData);
      console.log('Register response:', response);

      if (response.success) {
        // Registrasi berhasil, tampilkan alert dan redirect ke login
        Alert.alert(
          'Registrasi Berhasil! 🎉',
          'Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate ke Login screen
                navigation.navigate('Login');
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      console.error('Register error:', error);

      if (error.errors) {
        setErrors(error.errors);

        const firstError = Object.values(error.errors)[0];
        Alert.alert(
          'Validasi Gagal',
          Array.isArray(firstError) ? firstError[0] : String(firstError),
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Terjadi kesalahan saat registrasi',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Akun</Text>
          <Text style={styles.subtitle}>
            Isi data diri Anda untuk membuat akun
          </Text>
        </View>

        <View style={styles.form}>
          {/* Nama */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap *</Text>
            <TextInput
              style={[styles.input, errors.nama && styles.inputError]}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#9CA3AF"
              value={formData.nama}
              onChangeText={value => handleChange('nama', value)}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.nama && <Text style={styles.errorText}>{errors.nama}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Masukkan email"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={value => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.email && (
              <Text style={styles.errorText}>
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </Text>
            )}
          </View>

          {/* No HP */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor HP *</Text>
            <TextInput
              style={[styles.input, errors.no_hp && styles.inputError]}
              placeholder="Contoh: 08123456789"
              placeholderTextColor="#9CA3AF"
              value={formData.no_hp}
              onChangeText={value => handleChange('no_hp', value)}
              keyboardType="phone-pad"
              editable={!loading}
            />
            {errors.no_hp && (
              <Text style={styles.errorText}>{errors.no_hp}</Text>
            )}
          </View>

          {/* Alamat */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.alamat && styles.inputError,
              ]}
              placeholder="Masukkan alamat lengkap"
              placeholderTextColor="#9CA3AF"
              value={formData.alamat}
              onChangeText={value => handleChange('alamat', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!loading}
            />
            {errors.alamat && (
              <Text style={styles.errorText}>{errors.alamat}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Minimal 6 karakter"
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
              secureTextEntry
              editable={!loading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Konfirmasi Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Password *</Text>
            <TextInput
              style={[
                styles.input,
                errors.password_confirmation && styles.inputError,
              ]}
              placeholder="Masukkan ulang password"
              placeholderTextColor="#9CA3AF"
              value={formData.password_confirmation}
              onChangeText={value =>
                handleChange('password_confirmation', value)
              }
              secureTextEntry
              editable={!loading}
            />
            {errors.password_confirmation && (
              <Text style={styles.errorText}>
                {errors.password_confirmation}
              </Text>
            )}
          </View>

          {/* Button Register */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                  Mendaftar...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          {/* Link ke Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.linkText}>Login di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default RegisterScreen;
