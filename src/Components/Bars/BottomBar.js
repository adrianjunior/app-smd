import React from 'react'
import { FooterTab, Button, Icon, Text, Footer } from 'native-base'

const bottomBar = props => {

    return(
        <Footer>
            <FooterTab>
                <Button vertical
                        active={props.active[0]}
                        onPress={() => props.action(0)}>
                    <Icon name="pin" />
                    <Text>Salas</Text>
                </Button>
                <Button vertical
                        active={props.active[1]}
                        onPress={() => props.action(1)}>
                    <Icon name="key" />
                    <Text>Chaves</Text>
                </Button>
                <Button vertical
                        active={props.active[2]}
                        onPress={() => props.action(2)}>
                    <Icon active name="camera" />
                    <Text>Recursos</Text>
                </Button>
                {
                    props.user == 0 ?
                    <Button vertical
                            active={props.active[3]}
                            onPress={() => props.action(3)}>
                        <Icon name="log-in" />
                        <Text>Login</Text>
                    </Button> :
                    <Button vertical
                            active={props.active[3]}
                            onPress={() => props.action(3)}>
                        <Icon name="menu" />
                        <Text>Mais</Text>
                    </Button>
                }
            </FooterTab>
        </Footer>
    )
}

export default bottomBar