import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { authFetch } from '../../utils/authFetch';
import { IP_PUBLIC } from '../../config/IpPublic';

type Room = {
  id: number;
  nama_kamar: string;
  kapasitas: number;
  harga: number;
  status: string;
  foto: string | null;
};

export default function HomeScreen({ navigation }: any) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const response = await authFetch('/rooms');

      console.log('STATUS:', response.status);

      const data = await response.json();
      console.log('ROOM RESPONSE:', data);

      setRooms(data);
    } catch (error) {
      console.log('ERROR GET ROOMS:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={rooms}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('RoomDetail', { room: item })}
          style={{
            marginBottom: 16,
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
          }}
        >
          {item.foto && (
            <Image
              source={{ uri: `${IP_PUBLIC}/storage/${item.foto}` }}
              style={{ height: 150, borderRadius: 8, marginBottom: 10 }}
            />
          )}

          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {item.nama_kamar}
          </Text>

          <Text>Kapasitas: {item.kapasitas} orang</Text>
          <Text>Harga: Rp {item.harga}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
