import React from 'react'
import { List, ListItem, Body, Text, Right, Badge } from 'native-base'

const roomsList = props => {
    let roomsList = []
    if(props.rooms != undefined) {
        Object.values(props.rooms).forEach((room) => {
            roomsList.push(
                <ListItem button onPress={() => props.go('Room', {room: room})}>
                        <Body>
                            <Text>{room.name}</Text>
                            {
                                room.nowLesson != undefined ?
                                <Text>
                                    {room.nowLesson.startTime} às {room.nowLesson.endTime} - {room.nowLesson.name}
                                </Text> : null
                            }
                            {
                                room.nowLesson != undefined ?
                                <Text>
                                    Responsável(eis): {room.nowLesson.teacher}
                                </Text> : null
                            }
                        </Body>
                        {room.status === true || room.status === "true" ?
                            <Right>
                                <Badge success>
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