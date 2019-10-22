import React from 'react'
import { Header, Body, Title, Left, Right, Button, Icon } from 'native-base'

const topBar = props => {
    return(
        <Header hasTabs={props.hasTabs}>
            <Left style={{flex: 1}}>
                {props.back != undefined ?
                    <Button transparent onPress={() => props.back()}>
                        <Icon name='arrow-back' />
                    </Button> :  null 
                }
            </Left>
            <Body style={{flex: 4}}>
                <Title>{props.title}</Title>
            </Body>
            <Right style={{flex: 0.1}}/>
        </Header>
    )
}

export default topBar