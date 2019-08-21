import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking
} from 'react-native';
import { ScrollView } from 'react-navigation';
import * as WebBrowser from 'expo-web-browser';
import { Avatar, Icon, Image } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import { AmpEvent } from '../withAmplitude';

export default class DetailHeader extends Component {
  render() {
    let profile = this.props.profile;

    return (
      <View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.TouchableOpacity]}
            onPress={() =>
              this.props.navigation.navigate(
                this.props.myProfile ? 'MyPro' : 'Pro'
              )
            }
          >
            <View style={styles.ButtonStyle}>
              <Text style={styles.CampaignButton}>Campaigns</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.TouchableOpacity,
              null ? {} : { borderBottomColor: '#00FF9D', borderBottomWidth: 2 }
            ]}
          >
            <View style={styles.ButtonStyle}>
              <Text style={styles.DetailButton}>Details</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.avatarInfoWrap}>
            <View style={styles.header}>
              <Avatar
                size='large'
                rounded
                source={{
                  uri: profile.profile_image
                }}
              />
              <View style={styles.textContainer}>
                <View>
                  <Text style={styles.title}>{profile.org_name}</Text>
                  <Text style={styles.location}>{profile.location}</Text>
                </View>
                <Text
                  onPress={async () => {
                    profile.org_link_url &&
                      profile.org_link_url !== null &&
                      await AmpEvent('Website Link Clicked', {
                        orgName: profile.org_name
                      });
                    await WebBrowser.openBrowserAsync(profile.org_link_url);
                  }}
                >
                  {profile.org_link_text}
                </Text>
              </View>
              <View style={styles.SocialContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    await Linking.openURL(`mailto:${profile.email}`);
                  }}
                >
                  <SvgUri
                    width='25'
                    height='25'
                    source={require('../../assets/icons/envelope.svg')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 0, padding: 0 }}
                  onPress={async () =>
                    profile.instagram &&
                    profile.instagram !== null &&
                    (await WebBrowser.openBrowserAsync(profile.instagram))
                  }
                >
                  <SvgUri
                    width='25'
                    height='25'
                    source={require('../../assets/icons/instagram.svg')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    profile.twitter &&
                    profile.twitter !== null &&
                    (await WebBrowser.openBrowserAsync(profile.twitter))
                  }
                >
                  <SvgUri
                    width='25'
                    height='25'
                    source={require('../../assets/icons/twitter.svg')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () =>
                    profile.facebook &&
                    profile.facebook !== null &&
                    (await WebBrowser.openBrowserAsync(profile.facebook))
                  }
                >
                  <SvgUri
                    width='25'
                    height='25'
                    source={require('../../assets/icons/facebook.svg')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginBottom: -10
  },
  title: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: '600'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 5,
    padding: 25,
    backgroundColor: '#fff',
    width: '100%',
    height: 173
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomColor: 'whitesmoke'
  },
  TouchableOpacity: {
    flex: 1
  },
  ButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#eee',
    marginTop: 12,
    marginBottom: 12,
    flex: 1
  },
  CampaignButton: {
    fontSize: 18,
    color: '#C4C4C4',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold'
  },
  DetailButton: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold'
  },
  SocialContainer: {
    paddingTop: 30,
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%'
  },
  SocialIcon: {},
  avatarInfoWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
