import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItem, Body, Text } from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#006CB4',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    }
  });

const requestsList = props => {
    let requestsList = []
    
    if(props.requests != undefined) {
        props.requests.forEach((request) => {
            if(request.key !== undefined) { //CHAVE
                requestsList.push(
                    <ListItem button onPress={() => props.action(request, "key")}>
                        <Body>
                            <Text>style={[styles.title, styles.bold]}>{request.key}</Text>
                            <Text>Local: <Text style={styles.bold}>{request.place}</Text></Text>
                            <Text>Usuário: <Text style={styles.bold}>{request.user}</Text></Text>
                            <Text>Curso: <Text style={styles.bold}>{request.course}</Text></Text>
                        </Body>
                    </ListItem>  
                )  
            } else if(props.request.resource !== undefined) { //RECURSO
                requestsList.push(
                    <ListItem button onPress={() => props.action(request, "resource")}>
                        <Body>
                            <Text>style={[styles.title, styles.bold]}>{request.resource}</Text>
                            <Text>Local: <Text style={styles.bold}>{request.place}</Text></Text>
                            <Text>Usuário: <Text style={styles.bold}>{request.user}</Text></Text>
                            <Text>Curso: <Text style={styles.bold}>{request.course}</Text></Text>
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