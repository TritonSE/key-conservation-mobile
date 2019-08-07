import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { ScrollView } from "react-navigation";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStorage from "expo-secure-store";
import { Icon } from "react-native-elements";

import { getCampaigns } from "../store/actions";

import Campaign from "../components/FeedScreen/Campaign";

import styles from "../constants/Stylesheet";

function FeedScreen(props) {
  let { allCampaigns } = useSelector(state => state);
  const dispatch = useDispatch();
  const { navigation } = props;

  useEffect(() => {
    dispatch(getCampaigns());
    let refreshInterval = setInterval(() => dispatch(getCampaigns()), 10000);
  }, []);

  return (
    <ScrollView>
      <Button
        title="LOGOUT"
        onPress={async () => {
          await SecureStorage.deleteItemAsync("sub", {});
          await SecureStorage.deleteItemAsync("email", {});
          await SecureStorage.deleteItemAsync("roles", {});
          await SecureStorage.deleteItemAsync("userId", {});
          props.navigation.navigate("Loading");
        }}
      />
      <View style={styles.feedContainer}>
        {allCampaigns.length > 0 &&
          allCampaigns.map(campaign => {
            return (
              <Campaign
                key={campaign.camp_id}
                data={campaign}
                navigation={navigation}
              />
            );
          })}
      </View>
    </ScrollView>
  );
}

FeedScreen.navigationOptions = {
  title: 'Feed',
  // headerRight: <Icon name='search' type='font-awesome' />, // Find out how to implement this better. And how to style this!
  // This setting needs to be on every screen so that header is in the center
  // This is fix for andriod devices should be good on IOS
  headerStyle: {
    backgroundColor: '#323338'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    fontFamily: 'OpenSans-SemiBold',
  }
};

export default FeedScreen;
