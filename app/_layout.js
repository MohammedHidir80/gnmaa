
import { Stack } from "expo-router";
import { PaystackProvider } from "react-native-paystack-webview";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaystackProvider
        publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY}
        currency="GHS"
        defaultChannels={['card', 'mobile_money']} 
      >
        <Stack screenOptions={{ headerShown: false }} />
      </PaystackProvider>
    </AuthProvider>
  );
}