import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../../config/IpPublic';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login gagal', data.message);
        return;
      }

      await login(data.token, data.user);
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#2563eb',
          padding: 15,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>
          {loading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
