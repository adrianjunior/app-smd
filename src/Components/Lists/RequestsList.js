import React from 'react'
import { List, ListItem, Body, Text } from 'native-base'

const requestsList = props => {
    let requestsList = []
    
    if(props.requests != undefined) {
        props.requests.forEach((request) => {
            if(request.key !== undefined) { //CHAVE
                requestsList.push(
                    <ListItem button onPress={() => props.action(request, "key")}>
                        <Body>
                            <Text>{request.key}</Text>
                            <Text>Local: {request.place}</Text>
                            <Text>Usuário: {request.user}</Text>
                            <Text>Curso: {request.course}</Text>
                        </Body>
                    </ListItem>  
                )  
            } else if(props.request.resource !== undefined) { //RECURSO
                requestsList.push(
                    <ListItem button onPress={() => props.action(request, "resource")}>
                        <Body>
                            <Text>{request.key}</Text>
                            <Text>Local: {request.place}</Text>
                            <Text>Usuário: {request.user}</Text>
                            <Text>Curso: {request.course}</Text>
                        </Body>
                    </ListItem>  
                )
            }
        })
    }
    console.log(requestsList)
    return(
        <List>
            {requestsList}
        </List>
    )
}

export default requestsList