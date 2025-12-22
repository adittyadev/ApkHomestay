import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/IpPublic';

export const authFetch = async (url: string, options: any = {}) => {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.body instanceof FormData
        ? {} // ⬅️ JANGAN set Content-Type
        : { 'Content-Type': 'application/json' }),
    },
  });
};
