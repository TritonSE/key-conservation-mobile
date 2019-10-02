import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";


// url for heroku staging vs production server
const seturl = "https://key-conservation-staging.herokuapp.com/api/";

const LikeButton = props => {

  const [likes, setLikes] = useState(props.data.likes.length);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    console.log('something')
    const liked = props.data.likes.filter(
      l => l.users_id === props.currentUserProfile.id
    );
    if (liked.length > 0) {
      setUserLiked(true);
    }

    getLikes(props.data.camp_id)

  }, [ likes ]);


  const getLikes = (id) => {
      axios
        .get(`${seturl}social/likes/${id}`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${props.token}`,
                "Content-Type": "application/json"
            }
        }
        )
        .then(res => {
            setLikes(res.data.data.length)
            // setUserLiked(!userLiked)
        })
  }

  const addLike = () => {
      console.log(props.data.update_id)
    axios
      .post(
        `${seturl}social/likes/${props.data.camp_id ? props.data.camp_id : props.data.update_id}`,
        {
          users_id: props.currentUserProfile.id,
          camp_id: props.data.camp_id ? props.data.camp_id : null,
          update_id: props.data.update_id ? props.data.update_id : null
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        // setLikes(res.data.data.length);
        setUserLiked(true);
        props.getCampaigns()
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteLike = () => {
    if (props.data.update_id) {
        console.log(props.data.update_id, 'update', props.currentUserProfile.id, 'user')
        axios
          .delete(
            `${seturl}social/update/${
              props.data.update_id
            }/${props.currentUserProfile.id}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${props.token}`,
                "Content-Type": "application/json"
              }
            }
          )
          .then(res => {
            // setLikes(likes - 1);
            setUserLiked(false);
            props.getCampaigns()
          })
          .catch(err => {
            console.log(err);
          });
    } else {
        console.log(props.data.camp_id, 'camp', props.currentUserProfile.id, 'user')
        axios
          .delete(
            `${seturl}social/likes/${
              props.data.camp_id
            }/${props.currentUserProfile.id}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${props.token}`,
                "Content-Type": "application/json"
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

  return (
    <View>
      <View>
        {userLiked === false ? (
          <FontAwesome
            onPress={() => addLike()}
            name='heart-o'
            style={{
              fontSize: 28,
              marginLeft: 15,
              marginTop: 15,
              color: "#00FF9D"
            }}
          />
        ) : (
          <FontAwesome
            onPress={() => deleteLike()}
            name='heart'
            style={{
                fontSize: 28,
                marginLeft: 15,
                marginTop: 15,
                color: '#00FF9D'
              }}
          />
        )}
      </View>
      {likes === 0 ? null : likes > 1 ? (
        <Text style={{marginLeft: 15}}>{likes} likes</Text>
      ) : (
        <Text style={{marginLeft: 15}}>{likes} like</Text>
      )}
    </View>
  );
};

export default LikeButton;
