import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Choose how you want to send feedback:',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:feedback@muruganwallpapers.com'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, color = '#333', showArrow = true }) => (
    <TouchableOpacity
      style={[styles.menuItem, isDark && styles.menuItemDark]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={isDark ? '#fff' : color} />
        <Text style={[styles.menuItemText, isDark && styles.textDark]}>
          {title}
        </Text>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#666' : '#ccc'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#FF6B35" />
          </View>
          <Text style={[styles.userName, isDark && styles.textDark]}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={[styles.userPhone, isDark && styles.textDark]}>
            {user?.phoneNumber || '+91 XXXXXXXXXX'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Account
          </Text>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Support
          </Text>
          <MenuItem
            icon="chatbubble-outline"
            title="Send Feedback"
            onPress={handleFeedback}
          />
          <MenuItem
            icon="star-outline"
            title="Rate App"
            onPress={() => Alert.alert('Thank You!', 'Please rate us on the app store')}
          />
          <MenuItem
            icon="share-social-outline"
            title="Share App"
            onPress={() => Alert.alert('Share', 'Share this app with friends!')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            About
          </Text>
          <MenuItem
            icon="information-circle-outline"
            title="About App"
            onPress={() =>
              Alert.alert(
                'Murugan Wallpapers',
                'Version 1.0.0\n\nA devotional app for Lord Murugan wallpapers and videos.'
              )
            }
          />
          <MenuItem
            icon="document-text-outline"
            title="Terms & Privacy"
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, isDark && styles.textDark]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  textDark: {
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemDark: {
    backgroundColor: '#2a2a2a',
    borderBottomColor: '#333',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 30,
  },
});

export default ProfileScreen;
