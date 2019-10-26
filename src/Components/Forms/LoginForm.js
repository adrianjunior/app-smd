import React from 'react'
import { Form, Input, Item, Label, Button, Text } from 'native-base';

/* Falta o 'Recuperar Senha' */

const loginForm = props => {
    return(
        <Form>
            <Item inlineLabel>
                <Label>Email</Label>
                <Input value={props.email} onChangeText={props.onChangeEmail}/>
            </Item>
            <Item inlineLabel last>
                <Label>Senha</Label>
                <Input secureTextEntry={true} value={props.password} onChangeText={props.onChangePassword}/>
            </Item>
            <Button block disabled={props.disabled} onPress={props.login}>
              <Text>Entrar</Text>
            </Button>
        </Form>
    )
}

export default loginForm