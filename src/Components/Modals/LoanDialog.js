import { Alert } from 'react-native'

const loanDialog = (title, message, actionText, action, resource, target) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
          {text: actionText, onPress: () => action(resource, target)},
        ],
        {cancelable: false},
    );
}

export default loanDialog