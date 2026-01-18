import { useEffect } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log('🔍 Current permission status:', result);

    if (result === RESULTS.DENIED) {
      const permissionRequest = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log('🟡 Requested permission result:', permissionRequest);
    } else if (result === RESULTS.BLOCKED) {
      console.log('🔴 Permission is blocked. Redirecting to settings...');
      openSettings();
    } else {
      console.log('✅ Already granted.');
    }
  } else {
    console.log('❗ Notification permission not required on this Android version.');
  }
};

useEffect(() => {
  setTimeout(() => {
    requestNotificationPermission();
  }, 1000);
}, []);
