import React, { Component } from 'react'
import moment from "moment/min/moment-with-locales";

import RoomsList from '../../Components/Lists/RoomsList'
import { withFirebase } from '../../Firebase/index';

class Rooms extends Component {
    constructor(props){
        super(props)
    }

    state = {
        user: 0,
        active: 0,
        rooms: []
    }

    componentDidMount() {
        this.listener = this.props.firebase.getRooms()
            .onSnapshot(querySnapshot => {
                this.rooms = []
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if(data.status === "false") {
                        data.status = false
                    }
                    this.rooms[data.name] = {name: data.name,
                                             status: data.status,
                                             nowLesson: undefined,
                                             mondayLessons: [],
                                             tuesdayLessons: [],
                                             wednesdayLessons: [],
                                             thursdayLessons: [],
                                             FridayLessons: [],
                                             SaturdayLessons: [],}
                });
                this.props.firebase.getLessons()
                    .onSnapshot(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const timeFormat = 'HH:mm'
                            const dateFormat = 'dddd'
                            const id = doc.id
                            const data = doc.data()
                            if (this.checkLessonNow(data.startTime, data.endTime, data.day, timeFormat, dateFormat)){
                                this.rooms[data.room].nowLesson = {id, ...data}
                                this.rooms[data.room].status = false
                            }
                            switch(data.day){
                                case 'Segunda-feira':
                                    this.rooms[data.room].mondayLessons.push({id, ...data})
                                    break;
                                case 'Terça-feira':
                                    this.rooms[data.room].tuesdayLessons.push({id, ...data})
                                    break;
                                case 'Quarta-feira':
                                    this.rooms[data.room].wednesdayLessons.push({id, ...data})
                                    break;
                                case 'Quinta-feira':
                                    this.rooms[data.room].thursdayLessons.push({id, ...data})
                                    break;
                                case 'Sexta-feira':
                                    this.rooms[data.room].FridayLessons.push({id, ...data})
                                    break;
                                case 'Sábado':
                                    this.rooms[data.room].SaturdayLessons.push({id, ...data})
                                    break;
                            }
                        });
                        this.setState({rooms: this.rooms})
                }, error => {
                    this.setState({ error });
                })
            }, error => {
                this.setState({ error });
            })
    }

    componentWillUnmount() {
        this.listener()
    }

    checkLessonNow = (startTime, endTime, day, timeFormat, dateFormat) => {
        //Checa se a hora atual está entre o início e o fim de alguma aula e se é o mesmo dia
        moment.locale('pt-br')
        const now = moment()
        const st = moment(startTime, timeFormat)
        const et = moment(endTime, timeFormat)
        if(now.isBetween(st, et, null, '[]') && 
            moment().format(dateFormat) == day){
                return true
            }
        return false
    }

    render() {
        return (
            <RoomsList rooms={this.state.rooms} go={this.props.go}/>
        )
    }
}

export default withFirebase(Rooms)