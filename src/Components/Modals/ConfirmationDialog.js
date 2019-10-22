import { Alert } from 'react-native'

const confirmationDialog = (title, message, actionText, action) => {
    console.log(action)
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
          {text: actionText, onPress: () => action()},
        ],
        {cancelable: false},
    );
}

export default confirmationDialog