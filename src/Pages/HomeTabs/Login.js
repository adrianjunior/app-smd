import React, { Component } from 'react'

import LoginForm from '../../Components/Forms/LoginForm'
import { withFirebase } from '../../Firebase/index';

class Login extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const { email, password, error, onChangeEmail, onChangePassword, onLogin } = this.props;
        const isInvalid = password === '' || email === '';

        return (
            <LoginForm login={onLogin}
                       email={email}
                       password={password}
                       disabled={isInvalid}
                       onChangeEmail={onChangeEmail}
                       onChangePassword={onChangePassword}/>
        )
    }
}

export default withFirebase(Login)