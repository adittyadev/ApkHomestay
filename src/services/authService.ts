import { API_URL } from '../config/IpPublic';

export const register = async (data: {
  nama: string;
  email: string;
  no_hp: string;
  alamat: string;
  password: string;
  password_confirmation: string;
}) => {
  console.log('Register API URL:', API_URL);
  console.log('Register data:', data);

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const result = await response.json();
    console.log('Response data:', result);

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error('Register service error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  console.log('Login API URL:', API_URL);

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);

    const result = await response.json();
    console.log('Login response data:', result);

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};
