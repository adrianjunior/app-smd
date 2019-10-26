import React, { Component } from 'react';
import { Container, Content, StyleProvider } from 'native-base'
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

import TopBar from '../Components/Bars/TopBar'
import LessonsList from '../Components/Lists/LessonsList';

class Room extends Component {
    constructor(props){
        super(props)
    }

    state = {
        room: {}
    }

    componentDidMount() {
        const room = this.props.navigation.getParam('room', {})
        this.setState({room: room})
    }

    goBack = () => {
        this.props.navigation.goBack()
    }
    
    render() {
        const room = this.state.room

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <TopBar title={room.name}
                            back={this.goBack}/>
                    <Content>
                        <LessonsList mondayLessons={room.mondayLessons}
                                     tuesdayLessons={room.tuesdayLessons}
                                     wednesdayLessons={room.wednesdayLessons}
                                     thursdayLessons={room.thursdayLessons}
                                     fridayLessons={room.fridayLessons}
                                     saturdayLessons={room.saturdayLessons}/>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

export default Room