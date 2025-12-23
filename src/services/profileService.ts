import { authFetch } from '../utils/authFetch';

export const getProfile = async () => {
  const response = await authFetch('/profile');
  return response.json();
};

export const updateProfile = async (formData: FormData) => {
  const response = await authFetch('/profile/update', {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const logout = async () => {
  const response = await authFetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal logout');
  }

  return response.json();
};
