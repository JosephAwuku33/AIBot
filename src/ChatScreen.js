import React, { useState } from 'react';
import axios from 'axios';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { StyleSheet, ToastAndroid } from 'react-native';
import { CHAT_GPT_API_KEY } from "@env";
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          model: 'gpt-3.5-turbo',
        },
        {
          headers: {
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(err, 'api call error');
      ToastAndroid.show("Couldn't retrieve response", ToastAndroid.SHORT);
    }
  };

  const onSend = async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    const response = await sendMessage(newMessages[0].text);
    const latexString = `$${response}$`;

    //console.log(latexString);
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: latexString,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'GPT-3.5-turbo',
          avatar: require('../assets/favicon.png'),
        },
      },
    ];

    setMessages(prev => GiftedChat.append(prev, chatMessage));
  };

  const user = {
    _id: 1,
    name: 'Developer',
    avatar: require('../assets/splash.png'),
  };

  const renderInputToolbar = props => {
    return <InputToolbar {...props} containerStyle={styles.input} />;
  };

  const renderMessageText = props => {
    return <MathJaxSvg fontSize={14} style={styles.MathContainer} fontCache={true}>

      {props.currentMessage.text}
    </MathJaxSvg>

  };

  return (
    <GiftedChat messages={messages}
      onSend={onSend}
      user={user}
      placeholder={'Enter your expression'}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderInputToolbar={renderInputToolbar}
      messagesContainerStyle={styles.messageContainer}
      renderMessageText={renderMessageText}
    />

  )

    ;
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 30,
    backgroundColor: "#E5E4EF",
  },

  MathContainer: {
    padding: 10,
  },

  input: {
    borderColor: 'transparent',
    borderWidth: 0,
    padding: 5
  },
});



export default ChatScreen;
