import React, { useState, useEffect } from 'react';
import {
  Text,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import { NavigationEvents, withNavigationFocus } from 'react-navigation';
import { View } from 'react-native-animatable';
import moment from 'moment';
import { Video } from 'expo-av';
import { Avatar } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { Viewport } from '@skele/components';

import {
  getProfileData,
  getCampaign,
  toggleCampaignText
} from '../../store/actions';
import { AmpEvent } from '../withAmplitude';

import styles from '../../constants/FeedScreen/FeedCampaign';
import styles2 from '../../constants/Comments/Comments';

// url for heroku staging vs production server
const seturl = 'https://key-conservation.herokuapp.com/api/';

const Placeholder = () => <View style={styles.campImgContain} />;

// Redux gave us a hard time on this project. We worked on comments first and when our commentOnCampaign action failed to trigger the re-render we expected, and when we couldn't solve the
// issue in labs_help, we settled for in-component axios calls. Not elegant. Probably not super scalable—but it worked. Hopefully a more talented team can solve what we couldn't.
// In the meantime, ViewCampScreen, ViewCampUpdateScreen, FeedCampaign, and FeedUpdate are all interconnected, sharing props (state, functions) via React-Navigation.

const ViewportAwareVideo = Viewport.Aware(
  Viewport.WithPlaceholder(Video, Placeholder)
);

const FeedCampaign = props => {
  const [likes, setLikes] = useState(props.data.likes.length);
  const [userLiked, setUserLiked] = useState(false);
  const [userBookmarked, setUserBookmarked] = useState(false);
  const [urgTop, setUrgTop] = useState(0);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const liked = data.likes.filter(
      l => l.users_id === props.currentUserProfile.id
    );
    const bookmarked = props.currentUserProfile.bookmarks.filter(
      b => b.camp_id === data.camp_id
    );
    if (liked.length > 0) {
      setUserLiked(true);
    }
    if (bookmarked.length > 0) {
      setUserBookmarked(true);
    }
    if (
      data.camp_img.includes('.mov') ||
      data.camp_img.includes('.mp3') ||
      data.camp_img.includes('.mp4')
    ) {
      setUrgTop(3);
    }
  }, []);

  const dispatch = useDispatch();
  const { data, toggled } = props;

  const shorten = (string, cutoff) => {
    if (string.length < cutoff) {
      return string;
    } else {
      let end = cutoff;
      const avoidChars = [' ', ',', '.', '!'];
      while (avoidChars.includes(string.charAt(end)) && end >= cutoff - 10) {
        end--;
      }
      return `${string.substring(0, end)}...`;
    }
  };

  const createdAt = data.created_at;
  const currentTime = moment();
  const postTime = moment(createdAt);
  let timeDiff;
  if (currentTime.diff(postTime, 'days') < 1) {
    if (currentTime.diff(postTime, 'hours') < 1) {
      if (currentTime.diff(postTime, 'minutes') < 1) {
        timeDiff = 'just now';
      } else {
        if (currentTime.diff(postTime, 'minutes') === 1) {
          timeDiff = `${currentTime.diff(postTime, 'minutes')} MINUTE AGO`;
        } else {
          timeDiff = `${currentTime.diff(postTime, 'minutes')} MINUTES AGO`;
        }
      }
    } else {
      if (currentTime.diff(postTime, 'hours') === 1) {
        timeDiff = `${currentTime.diff(postTime, 'hours')} HOUR AGO`;
      } else {
        timeDiff = `${currentTime.diff(postTime, 'hours')} HOURS AGO`;
      }
    }
  } else {
    if (currentTime.diff(postTime, 'days') === 1) {
      timeDiff = `${currentTime.diff(postTime, 'days')} DAY AGO`;
    } else {
      timeDiff = `${currentTime.diff(postTime, 'days')} DAYS AGO`;
    }
  }

  //// All styles for the urgency bar
  let urgencyColor;
  if (data.urgency === 'Critical') {
    urgencyColor = 'rgba(227,16,89,0.7)';
  } else if (data.urgency === 'Urgent') {
    urgencyColor = 'rgba(255,199,0,0.7)';
  } else if (data.urgency === 'Longterm') {
    urgencyColor = 'rgba(0,255,157,0.7)';
  } else {
    urgencyColor = '#323338BF';
  }
  let urgencyStatus;
  if (data.urgency) {
    urgencyStatus = data.urgency.toUpperCase();
  } else {
    urgencyStatus = 'Standard';
  }

  const urgencyStyles = {
    backgroundColor: urgencyColor,
    height: 37,
    width: '100%',
    position: 'absolute',
    top: urgTop,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  };

  const goToProfile = async () => {
    await dispatch(getProfileData(data.users_id));
    AmpEvent('Select Profile from Campaign', {
      profile: data.username,
      campaign: data.camp_name
    });
    props.navigation.navigate('Pro');
  };

  const goToCampaign = async () => {
    await dispatch(getCampaign(data.camp_id));
    AmpEvent('Select Profile from Campaign', {
      campaign: data.camp_name,
      profile: data.username
    });
    props.navigation.navigate('Camp', {
      likes: likes,
      userLiked: userLiked,
      addLike: addLike,
      deleteLike: deleteLike,
      userBookmarked: userBookmarked,
      addBookmark: addBookmark,
      deleteBookmark: deleteBookmark,
      media: data.camp_img
    });
  };

  const toggleText = () => {
    dispatch(toggleCampaignText(data.camp_id));
  };

  const onPlaybackStatusUpdate = status => {
    if (status.isBuffering && !status.isPlaying) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  };

  const addLike = (campId, updateId) => {
    if (updateId) {
      axios
        .post(
          `${seturl}social/update/${data.update_id}`,
          {
            users_id: props.currentUserProfile.id,
            update_id: data.update_id
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${props.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          setLikes(res.data.data.length);
          setUserLiked(true);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios
        .post(
          `${seturl}social/likes/${campId}`,
          {
            users_id: props.currentUserProfile.id,
            camp_id: campId
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${props.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          setLikes(res.data.data.length);
          setUserLiked(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const deleteLike = (campId, updateId) => {
    if (updateId) {
      axios
        .delete(
          `${seturl}social/update/${data.update_id}/${props.currentUserProfile.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${props.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          setLikes(likes - 1);
          setUserLiked(false);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios
        .delete(
          `${seturl}social/likes/${campId}/${props.currentUserProfile.id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${props.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          setLikes(likes - 1);
          setUserLiked(false);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const addBookmark = () => {
    axios
      .post(
        `${seturl}social/bookmark/${data.camp_id}`,
        {
          users_id: props.currentUserProfile.id,
          camp_id: data.camp_id
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(res => {
        setUserBookmarked(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteBookmark = () => {
    axios
      .delete(
        `${seturl}social/bookmark/${data.camp_id}/${props.currentUserProfile.id}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(res => {
        setUserBookmarked(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <ListItem
        onPress={goToProfile}
        title={
          <View>
            <Text style={styles.orgTitleView}>{data.username}</Text>
          </View>
        }
        leftAvatar={{ source: { uri: data.profile_image } }}
        subtitle={data.location}
      />
      <View>
        <TouchableOpacity activeOpacity={0.5} onPress={goToCampaign}>
          {data.camp_img.includes('.mov') ||
          data.camp_img.includes('.mp3') ||
          data.camp_img.includes('.mp4') ? (
            <View>
              {data.urgency ? (
                <View style={urgencyStyles}>
                  <Text style={styles.urgencyBarText}>{urgencyStatus}</Text>
                </View>
              ) : null}
              {loader ? (
                <View style={styles.indicator}>
                  <ActivityIndicator size='large' color='#00FF9D' />
                </View>
              ) : null}
              {props.isFocused ? (
                <ViewportAwareVideo
                  source={{
                    uri: data.camp_img
                  }}
                  retainOnceInViewport={false}
                  preTriggerRatio={-0.1}
                  rate={1.0}
                  isMuted={false}
                  shouldPlay={true}
                  isLooping
                  resizeMode='cover'
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                  style={styles.campImgContain}
                />
              ) : (
                <View style={styles.campImgContain} />
              )}
            </View>
          ) : (
            <ImageBackground
              source={{ uri: data.camp_img }}
              style={styles.campImgContain}
            >
              {data.urgency ? (
                <View style={urgencyStyles}>
                  <Text style={styles.urgencyBarText}>{urgencyStatus}</Text>
                </View>
              ) : null}
            </ImageBackground>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.iconRow}>
        <View style={styles.likesContainer}>
          <View style={styles.hearts}>
            <View style={!userLiked ? { zIndex: 1 } : { zIndex: -1 }}>
              <FontAwesome
                onPress={() => addLike(data.camp_id)}
                name='heart-o'
                style={styles.heartOutline}
              />
            </View>
            <View
              animation={userLiked ? 'zoomIn' : 'zoomOut'}
              style={
                (userLiked ? { zIndex: 1 } : { zIndex: -1 },
                Platform.OS === 'android'
                  ? { marginTop: -29, marginLeft: -1.25 }
                  : { marginTop: -28.75, marginLeft: -1.25 })
              }
              duration={300}
            >
              <FontAwesome
                onPress={() => deleteLike(data.camp_id)}
                name='heart'
                style={styles.heartFill}
              />
            </View>
          </View>
          {likes === 0 ? null : likes > 1 ? (
            <Text style={styles.likes}>{likes} likes</Text>
          ) : (
            <Text style={styles.likes}>{likes} like</Text>
          )}
        </View>
        <View style={styles.bookmarks}>
          <View style={!userBookmarked ? { zIndex: 1 } : { zIndex: -1 }}>
            <FontAwesome
              onPress={() => addBookmark()}
              name='bookmark-o'
              style={styles.bookmarkOutline}
            />
          </View>
          <View
            animation={userBookmarked ? 'zoomIn' : 'zoomOut'}
            style={
              (userBookmarked ? { zIndex: 1 } : { zIndex: -1 },
              { marginTop: -28.75, marginLeft: -1.25 })
            }
            duration={300}
          >
            <FontAwesome
              onPress={() => deleteBookmark()}
              name='bookmark'
              style={styles.bookmarkFill}
            />
          </View>
        </View>
      </View>
      <View style={styles.campDesc}>
        <Text style={styles.campDescName}>{data.camp_name}</Text>
        {toggled || data.camp_desc.length < 80 ? (
          <Text style={styles.campDescText}>{data.camp_desc}</Text>
        ) : (
          <Text style={styles.campDescText}>
            {shorten(data.camp_desc, 80)}
            &nbsp;
            <Text onPress={toggleText} style={styles.readMore}>
              Read More
            </Text>
          </Text>
        )}
      </View>
      <View style={{ marginLeft: 17 }}>
        <FlatList
          data={data.comments.slice(0, 1)}
          keyExtractor={comment => comment.comment_id.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles2.commentWrapper}>
                <View style={styles2.commentView}>
                  <View style={styles2.feedAvatar}>
                    <Avatar
                      rounded
                      source={{
                        uri: item.profile_image
                      }}
                    />
                  </View>
                  <View style={styles2.feedCommentWrapper}>
                    <Text style={styles2.username}>{item.username}</Text>
                    <Text style={styles2.commentBody}>{item.comment_body}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
      <View>
        {data.comments.length >= 1 ? (
          data.comments.length === 1 ? (
            <Text style={styles.comments} onPress={goToCampaign}>
              View {data.comments.length} comment
            </Text>
          ) : (
            <Text style={styles.comments} onPress={goToCampaign}>
              View all {data.comments.length} comments
            </Text>
          )
        ) : null}
      </View>
      <Text style={styles.timeText}>{timeDiff}</Text>
      <View style={styles.demarcation}></View>
    </View>
  );
};
const mapStateToProps = state => ({
  currentUserProfile: state.currentUserProfile,
  currentUser: state.currentUser,
  token: state.token
});
export default connect(
  mapStateToProps,
  {
    getProfileData,
    getCampaign,
    toggleCampaignText
  }
)(withNavigationFocus(FeedCampaign));
// withNavigationFocus unmounts video and prevents audio playing across the navigation stack
