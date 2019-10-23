import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItem, Body, Text, Right, Badge, Content } from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#006CB4',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    }
  });

const resourcesList = props => {
    let resourcesList = []
    
    if(props.resources != undefined) {
        props.resources.forEach((resource) => {
            if(!resource.status || resource.status == "false"){
                resourcesList.push(
                    <ListItem button onPress={() => props.swap(resource)}>
                        <Body>
                            <Text style={[styles.title, styles.bold]}>{resource.name}</Text>
                            {
                                resource.user != undefined ?
                                <Text>Usuário: {resource.user}</Text> : null
                            }
                        </Body>
                    </ListItem>  
                )
            } else {
                resourcesList.push(
                    <ListItem button onPress={() => props.loan(resource)}>
                        <Body>
                            <Text style={[styles.title, styles.bold]}>{resource.name}</Text>
                        </Body>
                        <Right>
                            <Badge success>
                                <Text>Livre</Text>
                            </Badge>
                        </Right>
                    </ListItem>  
                )
            }
        })
    }
    console.log(resourcesList)
    return(
        <Content>
            <List>
                {resourcesList}
            </List>
        </Content>
    )
}

export default resourcesList