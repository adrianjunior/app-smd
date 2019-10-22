import React from 'react'
import { List, ListItem, Body, Text, Right, Badge } from 'native-base'

const loansList = props => {
    let resourcesList = []
    
    if(props.loans != undefined) {
        props.resources.forEach((resource) => {
            if(!resource.status || resource.status == "false"){
                resourcesList.push(
                    <ListItem button onPress={() => props.swap(resource)}>
                        <Body>
                            <Text>{resource.name}</Text>
                            {
                                resource.user != undefined ?
                                <Text>Usuário: {resource.user}</Text> : null
                            }
                        </Body>
                    </ListItem>  
                )
            }
        })
    }
    console.log(resourcesList)
    return(
        <List>
            {resourcesList}
        </List>
    )
}

export default loansList