import { Alert } from 'react-native'

const loginDialog = (title, message, actionText, action) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
          {text: actionText, onPress: () => action(3)},
        ],
        {cancelable: false},
    );
}

export default loginDialog