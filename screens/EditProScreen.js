import React from "react";
import {
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { ScrollView, NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import BackButton from "../components/BackButton";
import * as SecureStorage from "expo-secure-store";
import DoneButton from "../components/DoneButton";
import UploadMedia from "../components/UploadMedia";

import { editProfileData, logout, clearMedia } from "../store/actions";
import { AmpEvent } from "../components/withAmplitude";

import styles from "../constants/screens/EditProScreen";

class EditProScreen extends React.Component {
  logoutPress = async () => {
    await SecureStorage.deleteItemAsync("sub", {});
    await SecureStorage.deleteItemAsync("email", {});
    await SecureStorage.deleteItemAsync("roles", {});
    await SecureStorage.deleteItemAsync("id", {});
    await SecureStorage.deleteItemAsync("userId", {});
    await SecureStorage.deleteItemAsync("accessToken", {});
    this.props.logout();
    this.props.navigation.navigate("Loading");
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Edit Profile",
      headerStyle: {
        backgroundColor: "#323338"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        textAlign: "center",
        flexGrow: 1,
        alignSelf: "center"
      },
      headerLeft: <BackButton navigation={navigation} />,
      headerRight: (
        <DoneButton
          navigation={navigation}
          pressAction={navigation.getParam("done")}
        />
      )
    };
  };

  state = {
    org_name: this.props.currentUserProfile.org_name,
    profile_image: this.props.currentUserProfile.profile_image,
    username: this.props.currentUserProfile.username,
    location: this.props.currentUserProfile.location,
    mini_bio: this.props.currentUserProfile.mini_bio,
    email: this.props.currentUserProfile.email,
    org_link_url: this.props.currentUserProfile.org_link_url,
    org_link_text: this.props.currentUserProfile.org_link_text,
    facebook: this.props.currentUserProfile.facebook,
    instagram: this.props.currentUserProfile.instagram,
    twitter: this.props.currentUserProfile.twitter,
    about_us: this.props.currentUserProfile.about_us,
    species_and_habitats: this.props.currentUserProfile.species_and_habitats,
    issues: this.props.currentUserProfile.issues,
    phone_number: this.props.currentUserProfile.phone_number,
    // supportUs: this.props.currentUserProfile.support_us,
    org_cta: this.props.currentUserProfile.org_cta
  };

  componentDidMount() {
    this.props.navigation.setParams({ done: this.done });
    if (this.isProfileComplete(this.state) === true) {
      return AmpEvent("Profile Completed");
    }
  }

  isProfileComplete = profile => {
    for (let p in profile) {
      if (!profile[p]) return false;
    }
    return true;
  };

  done = () => {
    let changes = this.state;
    if (this.props.mediaUpload) {
      changes = {
        ...this.state,
        profile_image: this.props.mediaUpload
      };
    }
    this.props.editProfileData(this.props.currentUserProfile.id, changes);
    if (this.props.firstLogin) {
      this.props.navigation.navigate("Home");
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior='height'
        keyboardVerticalOffset={86}
        enabled
      >
        <ScrollView>
          <NavigationEvents onWillFocus={this.props.clearMedia} />
          <View style={styles.sectionContainer}>
            <View style={styles.Card} />
            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Organization Name</Text>
              <TextInput
                ref={input => {
                  this.org_nameInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain}
                onChangeText={text => this.setState({ org_name: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.usernameInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.org_name}
                placeholder='Carribbean Sea Turtle Project'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Username</Text>
              <TextInput
                ref={input => {
                  this.usernameInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain}
                onChangeText={text => this.setState({ username: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.profileImageInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.username}
                placeholder='@CarribbeanSTP'
              />
            </View>

            <View style={styles.sections}>
              <UploadMedia circular />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Location</Text>
              <TextInput
                ref={input => {
                  this.locationInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain}
                onChangeText={text => this.setState({ location: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.mini_bioInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.location}
                placeholder='St. George’s, Grenada'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Bio</Text>
              <TextInput
                ref={input => {
                  this.mini_bioInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain2}
                onChangeText={text => this.setState({ mini_bio: text })}
                multiline={true}
                value={this.state.mini_bio}
                placeholder='We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Email</Text>
              <TextInput
                ref={input => {
                  this.emailInput = input;
                }}
                returnKeyType='next'
                placeholder='Email'
                keyboardType='email-address'
                style={styles.inputContain}
                onChangeText={text => this.setState({ email: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.orgLinkUrlInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.email}
                placeholder='hello@carribbeanseaturtle.org'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Website Link URL</Text>
              <TextInput
                ref={input => {
                  this.org_link_urlInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ org_link_url: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.orgLinkTextInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.org_link_url}
                placeholder='https://www.carribbbeanseaturtle.org'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Website Link Text</Text>
              <TextInput
                ref={input => {
                  this.orgLinkTextInput = input;
                }}
                returnKeyType='next'
                placeholder='How you wish your website to appear'
                style={styles.inputContain}
                onChangeText={text => this.setState({ org_link_text: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.orgCtaInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.org_link_text}
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Donation Link</Text>
              <TextInput
                ref={input => {
                  this.org_ctaInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ org_cta: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.facebookInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.org_cta}
                placeholder='https://www.carribbbeanseaturtle.org/donate'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Phone Number</Text>
              <TextInput
                ref={input => {
                  this.phoneInput = input;
                }}
                returnKeyType='next'
                keyboardType='numeric'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ phone_number: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.facebookInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.phone_number}
                placeholder='9998884747'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Facebook</Text>
              <TextInput
                ref={input => {
                  this.facebookInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ facebook: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.instagramInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.facebook}
                placeholder='www.facebook.com/CSTP'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Instagram</Text>
              <TextInput
                ref={input => {
                  this.instagramInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ instagram: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.twitterInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.instagram}
                placeholder='www.instagram.com/CSTP'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Twitter</Text>
              <TextInput
                ref={input => {
                  this.twitterInput = input;
                }}
                returnKeyType='next'
                keyboardType='url'
                style={styles.inputContain}
                autoCapitalize='none'
                placeholder='Please include full URL'
                onChangeText={text => this.setState({ twitter: text })}
                onSubmitEditing={() => {
                  if (Platform.OS === "android") return;
                  this.aboutUsInput.focus();
                }}
                blurOnSubmit={Platform.OS === "android"}
                value={this.state.twitter}
                placeholder='www.twitter.com/CSTP'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>About Us</Text>
              <TextInput
                ref={input => {
                  this.about_usInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain2}
                onChangeText={text => this.setState({ about_us: text })}
                multiline={true}
                value={this.state.about_us}
                placeholder='We have been working to conserve the sea turtles that visit our shores and surrounding ocean for the past 30 years.'
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Species & Habitats</Text>
              <TextInput
                ref={input => {
                  this.species_habitatsInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain2}
                onChangeText={text =>
                  this.setState({ species_and_habitats: text })
                }
                multiline={true}
                value={this.state.species_and_habitats}
                placeholder='We work with Hawksbill sea turtles,
                Leatherback sea turtles,Green sea turtles,
                the Caribbean Ocean and Atlantic Ocean, as well as the Coral Reef
                '
              />
            </View>

            <View style={styles.sections}>
              <Text style={styles.sectionsText}>Big Issues</Text>
              <TextInput
                ref={input => {
                  this.issuesInput = input;
                }}
                returnKeyType='next'
                style={styles.inputContain2}
                onChangeText={text => this.setState({ issues: text })}
                multiline={true}
                value={this.state.issues}
                placeholder='We are doing our best to tackle lights on the beach at night, as well as coral reef bleaching. We are aslo highly concerned with plastic pollution and working dilligently against it.'
              />
            </View>

            <View style={styles.logoutSection}>
              <Text style={styles.accountSettingsText}>Account Settings</Text>
              <TouchableOpacity
                onPress={this.logoutPress}
                style={styles.logoutButton}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  currentUserProfile: state.currentUserProfile,
  mediaUpload: state.mediaUpload
});

export default connect(
  mapStateToProps,
  { editProfileData, logout, clearMedia }
)(EditProScreen);
