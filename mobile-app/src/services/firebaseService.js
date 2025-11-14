import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  doc,
  setDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../firebase.config';

// Fetch wallpapers with pagination
export const fetchWallpapers = async (lastDoc = null, limitCount = 20) => {
  try {
    let q = query(
      collection(db, 'wallpapers'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'wallpapers'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const wallpapers = [];
    
    querySnapshot.forEach((doc) => {
      wallpapers.push({ id: doc.id, ...doc.data() });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { wallpapers, lastVisible };
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    throw error;
  }
};

// Fetch videos with pagination
export const fetchVideos = async (lastDoc = null, limitCount = 20) => {
  try {
    let q = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'videos'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const videos = [];
    
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { videos, lastVisible };
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Search wallpapers
export const searchWallpapers = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'wallpapers'),
      where('tags', 'array-contains', searchTerm.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    const wallpapers = [];
    
    querySnapshot.forEach((doc) => {
      wallpapers.push({ id: doc.id, ...doc.data() });
    });

    return wallpapers;
  } catch (error) {
    console.error('Error searching wallpapers:', error);
    throw error;
  }
};

// Add to favorites
export const addToFavorites = async (userId, itemId, itemType, itemData) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${itemId}`);
    await setDoc(favoriteRef, {
      userId,
      itemId,
      itemType, // 'wallpaper' or 'video'
      itemData,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove from favorites
export const removeFromFavorites = async (userId, itemId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${itemId}`);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Check if item is favorited
export const isFavorited = async (userId, itemId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${itemId}`);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Fetch user favorites
export const fetchUserFavorites = async (userId) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const favorites = [];
    
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });

    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};
