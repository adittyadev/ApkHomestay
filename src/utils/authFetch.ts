import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/IpPublic';

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');

  const body = (options as any).body;

  // Robust detection for FormData: instanceof may fail in some environments,
  // so also check for a `.append` function (duck-typing).
  const isFormData =
    (typeof FormData !== 'undefined' && body instanceof FormData) ||
    (body && typeof (body as any).append === 'function');
  const fullUrl = API_URL + url;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  } as Record<string, any>;

  // log minimal info to help debugging network issues
  console.log('[authFetch] ', { fullUrl, isFormData, headers });

  try {
    return await fetch(fullUrl, {
      ...options,
      headers,
    });
  } catch (err: any) {
    console.error('[authFetch] network error', { fullUrl, err });
    // rethrow with more context
    throw new Error(`Network request failed: ${err && err.message ? err.message : err}`);
  }
};
