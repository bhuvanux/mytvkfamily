import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';

export const downloadImage = async (imageUrl, imageName = 'wallpaper') => {
  try {
    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant media library permissions to download images.'
      );
      return false;
    }

    // Show loading indicator
    Alert.alert('Downloading', 'Please wait...');

    // Download the image
    const fileUri = FileSystem.documentDirectory + `${imageName}_${Date.now()}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status === 200) {
      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      // Create album if it doesn't exist
      const album = await MediaLibrary.getAlbumAsync('Murugan Wallpapers');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Murugan Wallpapers', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Success', 'Image downloaded successfully!');
      return true;
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download image. Please try again.');
    return false;
  }
};

export const checkDownloadPermissions = async () => {
  try {
    const { status } = await MediaLibrary.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};
