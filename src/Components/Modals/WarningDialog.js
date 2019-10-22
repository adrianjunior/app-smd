import { Alert } from 'react-native'

const warningDialog = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ],
        {cancelable: false},
    );
}

export default warningDialog