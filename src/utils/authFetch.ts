import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/IpPublic';

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');

  const isFormData = options.body instanceof FormData;

  return fetch(API_URL + url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
};
