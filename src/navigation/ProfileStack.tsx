import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screen/Profile/ProfileScreen';
import EditProfileScreen from '../screen/Profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil Saya' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profil' }}
      />
    </Stack.Navigator>
  );
}
