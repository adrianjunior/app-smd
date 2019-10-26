import React from 'react'
import { FooterTab, Button, Icon, Text, Footer } from 'native-base'

const bottomBarAdmin = props => {

    return(
        <Footer>
            <FooterTab>
                <Button vertical
                        active={props.active[0]}
                        onPress={() => props.action(0)}>
                    <Icon active name="text" />
                    <Text>Pedidos</Text>
                </Button>
                <Button vertical
                        active={props.active[1]}
                        onPress={() => props.action(1)}>
                    <Icon name="list-box" />
                    <Text>Emprést.</Text>
                </Button>
                <Button vertical
                        active={props.active[2]}
                        onPress={() => props.action(2)}>
                    <Icon name="pin" />
                    <Text>Salas</Text>
                </Button>
                <Button vertical
                        active={props.active[3]}
                        onPress={() => props.action(3)}>
                    <Icon name="menu" />
                    <Text>Mais</Text>
                </Button>
            </FooterTab>
        </Footer>
    )
}

export default bottomBarAdmin