import {View, Text, Image, Platform, Alert, Pressable} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styles} from './styles';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine-distance';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';

// Define types for the params
interface Params {
  image?: string;
  address?: string;
  description?: string;
  id?: number;
  latitude?: number;
  longitude?: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

const DetailScreen: React.FC = ({route}: any) => {
  const params = route.params.homeData as Params;
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [canUnlock, setCanUnlock] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(true);

  // Calculate if user location is within range
  const isWithinRange = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    userLocation: Location,
    homeLocation: Location,
  ): boolean => {
    const distance = haversine(userLocation, homeLocation);
    return distance <= 30; // distance in meters
  };

  const requestLocationPermission = async () => {
    try {
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert('Permission Denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const getLocation = () => {
    if (params.latitude && params.longitude) {
      Geolocation.getCurrentPosition(
        position => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userCoords);
          const homeCoords = {
            latitude: params.latitude,
            longitude: params.longitude,
          };
          setCanUnlock(isWithinRange(userCoords, homeCoords));
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a memoized function to render text information
  const renderTextInfo = useMemo(() => {
    return (title: string, description?: string): JSX.Element => (
      <View style={styles.textContainer}>
        <Text style={styles.heading}>{title}</Text>
        {description && (
          <Text style={styles.descriptionText}>{description}</Text>
        )}
      </View>
    );
  }, []);

  const onLockButtonPress = useCallback(() => {
    if (canUnlock) {
      setLocked(!locked);
    } else {
      Alert.alert('You are not in range');
    }
  }, [canUnlock, locked]);

  // Create a memoized function to render image
  const renderHomeImage = useMemo(() => {
    return (
      <View>
        <Image source={{uri: params.image}} style={styles.homeImage} />
        {/* Unlock button only be visible if the user's current location
            is within 30m of the home  */}
        {canUnlock ? (
          <Pressable style={styles.unLockButton} onPress={onLockButtonPress}>
            <Text>{locked ? 'Locked' : 'UnLocked'}</Text>
          </Pressable>
        ) : (
          null
        )}
      </View>
    );
  }, [params.image, canUnlock, onLockButtonPress, locked]);

  return (
    <ScreenWrapper>
      <Text style={styles.goBack} onPress={() => navigation.goBack()}>
        Go Back
      </Text>
      {renderHomeImage}

      {!locked ? (
        <View style={styles.descriptionContainer}>
          {renderTextInfo('Address:', params.address)}
          {renderTextInfo('Description:', params.description)}
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default DetailScreen;
