import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItem, Body, Text, Right, Badge, H3 } from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#F18C25',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    }
  });

const roomsList = props => {
    let roomsList = []
    if(props.rooms != undefined) {
        Object.values(props.rooms).forEach((room) => {
            roomsList.push(
                <ListItem button onPress={() => props.go('Room', {room: room})}>
                        <Body>
                            <Text style={[styles.title, styles.bold]}>{room.name}</Text>
                            {
                                room.nowLesson != undefined ?
                                <Text>
                                    {room.nowLesson.startTime} às {room.nowLesson.endTime} - <Text style={styles.bold}>{room.nowLesson.name}</Text>
                                </Text> : null
                            }
                            {
                                room.nowLesson != undefined ?
                                <Text>
                                    Responsável(eis): <Text style={styles.bold}>{room.nowLesson.teacher}</Text>
                                </Text> : null
                            }
                        </Body>
                        {room.status === true || room.status === "true" ?
                            <Right>
                                <Badge primary>
                                    <Text>Livre</Text>
                                </Badge>
                            </Right> : null
                        }
                </ListItem>
            )
        })
    }
    return(
        <List>
            {roomsList}
        </List>
    )
}

export default roomsList