import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { shareVideo } from '../utils/shareHelper';
import { addToFavorites, removeFromFavorites, isFavorited } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const VideoPlayerScreen = ({ route }) => {
  const { video } = route.params;
  const { user } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    if (user) {
      const favStatus = await isFavorited(user.uid, video.id);
      setIsFav(favStatus);
    }
  };

  const handleShare = async () => {
    try {
      await shareVideo(video.videoUrl, `Check out this video: ${video.title}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to share video');
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save favorites');
      return;
    }

    try {
      if (isFav) {
        await removeFromFavorites(user.uid, video.id);
        setIsFav(false);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        await addToFavorites(user.uid, video.id, 'video', video);
        setIsFav(true);
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={250}
          play={playing}
          videoId={video.youtubeId}
          onChangeState={(state) => {
            if (state === 'ended') {
              setPlaying(false);
            }
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.title}</Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={24} color="#FF6B35" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFavorite}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? '#FF6B35' : '#666'}
            />
            <Text style={styles.actionText}>
              {isFav ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.description}>
            Devotional video of Lord Murugan. Watch and share this beautiful
            video with your friends and family.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  playerContainer: {
    width: width,
    height: 250,
    backgroundColor: '#000',
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default VideoPlayerScreen;
