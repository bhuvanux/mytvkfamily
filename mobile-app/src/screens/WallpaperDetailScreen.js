import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { downloadImage } from '../utils/downloadHelper';
import { shareImage } from '../utils/shareHelper';
import { addToFavorites, removeFromFavorites, isFavorited } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const WallpaperDetailScreen = ({ route, navigation }) => {
  const { wallpaper } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    if (user) {
      const favStatus = await isFavorited(user.uid, wallpaper.id);
      setIsFav(favStatus);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadImage(wallpaper.imageUrl, wallpaper.title);
    } catch (error) {
      Alert.alert('Error', 'Failed to download image');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await shareImage(wallpaper.imageUrl, `Check out this ${wallpaper.title} wallpaper!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save favorites');
      return;
    }

    try {
      if (isFav) {
        await removeFromFavorites(user.uid, wallpaper.id);
        setIsFav(false);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        await addToFavorites(user.uid, wallpaper.id, 'wallpaper', wallpaper);
        setIsFav(true);
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: wallpaper.imageUrl }}
        style={styles.image}
        contentFit="cover"
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        placeholder={require('../../assets/placeholder.png')}
        transition={300}
      />

      {imageLoading && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      )}

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="download-outline" size={28} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFavorite}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={28}
            color={isFav ? '#FF6B35' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default WallpaperDetailScreen;
