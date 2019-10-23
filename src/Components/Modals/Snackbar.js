import { Toast } from "native-base";

const showSnackbar = (text, buttonText) =>
    Toast.show({
        text: text,
        buttonText: buttonText,
        duration: 3000
    })
    
export default showSnackbar