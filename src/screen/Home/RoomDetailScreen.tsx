import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IP_PUBLIC } from '../../config/IpPublic';

export default function RoomDetailScreen({ route, navigation }: any) {
  const { room } = route.params;

  return (
    <View style={{ padding: 16 }}>
      {room.foto && (
        <Image
          source={{ uri: `${IP_PUBLIC}/storage/${room.foto}` }}
          style={{ height: 200, borderRadius: 8 }}
        />
      )}

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>
        {room.nama_kamar}
      </Text>

      <Text>Kapasitas: {room.kapasitas} orang</Text>
      <Text>Harga per malam: Rp {room.harga}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('BookingForm', { room })}
        style={{
          backgroundColor: '#2563eb',
          padding: 15,
          marginTop: 20,
          alignItems: 'center',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Booking Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}
