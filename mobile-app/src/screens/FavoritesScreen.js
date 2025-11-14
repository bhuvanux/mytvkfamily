import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridItem from '../components/GridItem';
import VideoCard from '../components/VideoCard';
import { fetchUserFavorites } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // For demo, using mock favorites
      const mockFavorites = [
        {
          id: 'fav-1',
          itemType: 'wallpaper',
          itemData: {
            id: 'wallpaper-1',
            title: 'Lord Murugan 1',
            imageUrl: 'https://picsum.photos/400/600?random=1',
            thumbnailUrl: 'https://picsum.photos/200/300?random=1',
          },
        },
        {
          id: 'fav-2',
          itemType: 'video',
          itemData: {
            id: 'video-1',
            title: 'Murugan Bhajan 1',
            thumbnailUrl: 'https://picsum.photos/400/300?random=101',
            youtubeId: 'dQw4w9WgXcQ',
          },
        },
      ];
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  const filteredFavorites = favorites.filter((fav) => {
    if (activeTab === 'all') return true;
    return fav.itemType === activeTab;
  });

  const renderItem = ({ item, index }) => {
    if (item.itemType === 'wallpaper') {
      return (
        <GridItem
          item={item.itemData}
          onPress={() =>
            navigation.navigate('WallpaperDetail', { wallpaper: item.itemData })
          }
          index={index}
        />
      );
    } else {
      return (
        <VideoCard
          item={item.itemData}
          onPress={() =>
            navigation.navigate('VideoPlayer', { video: item.itemData })
          }
          index={index}
        />
      );
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.textDark]}>
            Please login to view favorites
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>
          My Favorites
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'wallpaper' && styles.activeTab]}
          onPress={() => setActiveTab('wallpaper')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'wallpaper' && styles.activeTabText,
            ]}
          >
            Wallpapers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'video' && styles.activeTab]}
          onPress={() => setActiveTab('video')}
        >
          <Text
            style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.textDark]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtext, isDark && styles.textDark]}>
            Start adding wallpapers and videos to your favorites
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B35"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 15,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  listContent: {
    padding: 10,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
