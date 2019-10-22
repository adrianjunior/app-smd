import React, { Component } from 'react'
import { List, ListItem, Body, Text, Left, Icon } from 'native-base';

import { withFirebase } from '../../Firebase/index'

class More extends Component {
    constructor(props){
        super(props)
    }

    state = {
        user: 0,
        active: 0
    }

    componentDidMount() {
        const user = this.props.user
        this.setState({user: user})
    }

    render() {

        let content = null

        if(this.state.user == 1) { //Usuário
            content = <>
                        <List>
                            <ListItem button icon>
                                <Left>
                                    <Icon name="information-circle" />
                                </Left>
                                <Body>
                                    <Text>
                                        Minhas informações
                                    </Text>
                                </Body>
                            </ListItem>
                            <ListItem button icon>
                                <Left>
                                    <Icon name="swap" />
                                </Left>
                                <Body style={{paddingTop: 16, paddingBottom: 16}}>
                                    <Text>
                                        Troca de Chave ou Recurso
                                    </Text>
                                </Body>
                            </ListItem>
                            <ListItem button icon onPress={() => this.props.logout()}>
                                <Left>
                                    <Icon name="log-out" />
                                </Left>
                                <Body>
                                    <Text>
                                        Sair
                                    </Text>
                                </Body>
                            </ListItem>
                        </List>
                      </>
        } else if (this.state.user == 2) { //Admin

        }

        return (
            content
        )
    }
}

export default withFirebase(More)