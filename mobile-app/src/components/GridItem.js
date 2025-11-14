import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2;

const GridItem = ({ item, onPress, index }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { marginLeft: index % 2 === 0 ? 0 : 10 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.thumbnailUrl || item.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholder={require('../../assets/placeholder.png')}
      />
      <View style={[styles.overlay, isDark && styles.overlayDark]}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: itemWidth * 1.5,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  overlayDark: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GridItem;
