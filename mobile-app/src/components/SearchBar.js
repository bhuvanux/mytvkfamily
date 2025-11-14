import React from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Ionicons
        name="search"
        size={20}
        color={isDark ? '#999' : '#666'}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#666' : '#999'}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputDark: {
    color: '#fff',
  },
});

export default SearchBar;
