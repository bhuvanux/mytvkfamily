import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const shareImage = async (imageUrl, message = 'Check out this wallpaper!') => {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    // Download image to temporary location
    const fileUri = FileSystem.cacheDirectory + `share_${Date.now()}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status === 200) {
      // Share the image
      await Sharing.shareAsync(downloadResult.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: message,
        UTI: 'public.jpeg'
      });
      return true;
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Error', 'Failed to share image. Please try again.');
    return false;
  }
};

export const shareVideo = async (videoUrl, message = 'Check out this video!') => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    // For YouTube videos, share the URL directly
    await Sharing.shareAsync(videoUrl, {
      dialogTitle: message
    });
    
    return true;
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Error', 'Failed to share video. Please try again.');
    return false;
  }
};
