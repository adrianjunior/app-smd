import React from 'react'
import { List, ListItem, Text, Body } from 'native-base'

const lessonsList = props => {
    let mondayLessons = []
    let tuesdayLessons = []
    let wednesdayLessons = []
    let thursdayLessons = []
    let fridayLessons = []
    let saturdayLessons = []

    if(props.mondayLessons != undefined) {
        props.mondayLessons.forEach((lesson) => {
            mondayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }
    
    if(props.tuesdayLessons != undefined) {
        props.tuesdayLessons.forEach((lesson) => {
            tuesdayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }

    if(props.wednesdayLessons != undefined) {
        props.wednesdayLessons.forEach((lesson) => {
            wednesdayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }

    if(props.thursdayLessons != undefined) {
        props.thursdayLessons.forEach((lesson) => {
            thursdayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }

    if(props.fridayLessons != undefined) {
        props.fridayLessons.forEach((lesson) => {
            fridayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }

    if(props.saturdayLessons != undefined) {
        props.saturdayLessons.forEach((lesson) => {
            saturdayLessons.push(
                <ListItem>
                    <Body>
                        <Text>
                            {lesson.startTime} às {lesson.endTime} - {lesson.name}
                        </Text>
                        <Text>
                            Professor(es): {lesson.teacher}
                        </Text>
                    </Body>
                </ListItem>
            )
        })
    }

    return(
        <List>
            <ListItem itemDivider>
              <Text>Segunda-feira</Text>
            </ListItem>
            {mondayLessons}

            <ListItem itemDivider>
              <Text>Terça-feira</Text>
            </ListItem>
            {tuesdayLessons}

            <ListItem itemDivider>
              <Text>Quarta-feira</Text>
            </ListItem>
            {wednesdayLessons}

            <ListItem itemDivider>
              <Text>Quinta-feira</Text>
            </ListItem>
            {thursdayLessons}

            <ListItem itemDivider>
              <Text>Sexta-feira</Text>
            </ListItem>
            {fridayLessons}

            <ListItem itemDivider>
              <Text>Sábado</Text>
            </ListItem>
            {saturdayLessons}
        </List>
    )
}

export default lessonsList