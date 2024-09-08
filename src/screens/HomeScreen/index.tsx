import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../navigation/RouteNames';
import { HomeProjects } from '../../mockData/homeProjects';
import ScreenWrapper from '../../components/ScreenWrapper';
import { styles } from './styles';

// Define types for your data items
interface HomeProject {
  id: number;
  image: string;
  address: string;
  description: string;
}

// Type the navigation prop
type HomeScreenNavigationProp = {
  navigate: (screen: string, params: object) => void;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCardPress = (item: HomeProject) => {
    navigation.navigate(RouteNames.DetailScreen, { homeData: item });
  };

  const renderHome = ({ item }: { item: HomeProject }) => (
    <View style={styles.cardContainer}>
      <Pressable onPress={() => handleCardPress(item)}>
        <Image source={{ uri: item.image }} style={styles.homeImage} />
      </Pressable>
      <View style={styles.descriptionContainer}>
        <Text style={styles.homeAddress}>{item.address}</Text>
        <Text style={styles.homeDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const ItemSeparator = () => <View style={styles.itemSeparator} />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.mainHeading}>House Listing</Text>
        <FlatList
          data={HomeProjects}
          renderItem={renderHome}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
