/**
 * صفحه گالری تصاویر
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const imageSize = (width - theme.spacing.md * 4) / 2;

type GalleryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;

interface Props {
  navigation: GalleryScreenNavigationProp;
}

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  // نمونه تصاویر - بعداً با تصاویر واقعی جایگزین می‌شود
  const images = [
    { id: 1, title: 'رستم', url: 'https://via.placeholder.com/300/1a1a2e/f39c12?text=Rostam' },
    { id: 2, title: 'سهراب', url: 'https://via.placeholder.com/300/1a1a2e/f39c12?text=Sohrab' },
    { id: 3, title: 'نبرد', url: 'https://via.placeholder.com/300/1a1a2e/f39c12?text=Battle' },
    { id: 4, title: 'شاهنامه', url: 'https://via.placeholder.com/300/1a1a2e/f39c12?text=Shahnameh' },
  ];

  return (
    <LinearGradient
      colors={[
        theme.colors.background.gradient.start,
        theme.colors.background.gradient.middle,
        theme.colors.background.gradient.end,
      ]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={28}
            color={theme.colors.gold.main}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>گالری تصاویر</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.gridContainer}
      >
        {images.map((image, index) => (
          <Animatable.View
            key={image.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.imageCard}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: image.url }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
              >
                <Text style={styles.imageTitle}>{image.title}</Text>
              </LinearGradient>
            </View>
          </Animatable.View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
  },
  imageCard: {
    width: imageSize,
    height: imageSize,
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.sm,
  },
  imageTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
});

export default GalleryScreen;
