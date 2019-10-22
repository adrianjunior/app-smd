import { Alert } from 'react-native'

const answerDialog = (title, message, actionText1, action1, actionText2, action2, object) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
          {text: actionText1, onPress: () => action1(object)},
          {text: actionText2, onPress: () => action2(object)}
        ],
        {cancelable: true},
    );
}

export default answerDialog