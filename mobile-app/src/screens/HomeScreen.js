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
import SearchBar from '../components/SearchBar';
import GridItem from '../components/GridItem';
import VideoCard from '../components/VideoCard';
import { fetchWallpapers, fetchVideos, searchWallpapers } from '../services/firebaseService';

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('wallpapers');
  const [wallpapers, setWallpapers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastWallpaperDoc, setLastWallpaperDoc] = useState(null);
  const [lastVideoDoc, setLastVideoDoc] = useState(null);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'wallpapers') {
        // For demo, using mock data
        const mockWallpapers = generateMockWallpapers(20);
        setWallpapers(mockWallpapers);
      } else {
        const mockVideos = generateMockVideos(20);
        setVideos(mockVideos);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      if (activeTab === 'wallpapers') {
        const moreWallpapers = generateMockWallpapers(10, wallpapers.length);
        setWallpapers([...wallpapers, ...moreWallpapers]);
      } else {
        const moreVideos = generateMockVideos(10, videos.length);
        setVideos([...videos, ...moreVideos]);
      }
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [activeTab]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadInitialData();
      return;
    }

    try {
      if (activeTab === 'wallpapers') {
        const results = wallpapers.filter(w => 
          w.title.toLowerCase().includes(query.toLowerCase()) ||
          w.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setWallpapers(results);
      } else {
        const results = videos.filter(v => 
          v.title.toLowerCase().includes(query.toLowerCase())
        );
        setVideos(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const renderWallpaperItem = ({ item, index }) => (
    <GridItem
      item={item}
      onPress={() => navigation.navigate('WallpaperDetail', { wallpaper: item })}
      index={index}
    />
  );

  const renderVideoItem = ({ item, index }) => (
    <VideoCard
      item={item}
      onPress={() => navigation.navigate('VideoPlayer', { video: item })}
      index={index}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF6B35" />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>
          🕉️ Murugan Wallpapers
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={`Search ${activeTab}...`}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'wallpapers' && styles.activeTab]}
          onPress={() => setActiveTab('wallpapers')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'wallpapers' && styles.activeTabText,
            ]}
          >
            Wallpapers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'videos' && styles.activeTabText,
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'wallpapers' ? wallpapers : videos}
          renderItem={activeTab === 'wallpapers' ? renderWallpaperItem : renderVideoItem}
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
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

// Mock data generators for demo
const generateMockWallpapers = (count, startIndex = 0) => {
  const wallpapers = [];
  for (let i = 0; i < count; i++) {
    wallpapers.push({
      id: `wallpaper-${startIndex + i}`,
      title: `Lord Murugan ${startIndex + i + 1}`,
      imageUrl: `https://picsum.photos/400/600?random=${startIndex + i}`,
      thumbnailUrl: `https://picsum.photos/200/300?random=${startIndex + i}`,
      tags: ['murugan', 'devotional', 'hindu', 'god'],
      createdAt: new Date(),
    });
  }
  return wallpapers;
};

const generateMockVideos = (count, startIndex = 0) => {
  const videos = [];
  const videoIds = ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'];
  for (let i = 0; i < count; i++) {
    videos.push({
      id: `video-${startIndex + i}`,
      title: `Murugan Bhajan ${startIndex + i + 1}`,
      thumbnailUrl: `https://picsum.photos/400/300?random=${startIndex + i + 100}`,
      videoUrl: `https://www.youtube.com/watch?v=${videoIds[i % videoIds.length]}`,
      youtubeId: videoIds[i % videoIds.length],
      duration: '5:30',
      createdAt: new Date(),
    });
  }
  return videos;
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
    marginBottom: 15,
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
    fontSize: 16,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
