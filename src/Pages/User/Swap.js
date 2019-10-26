import React, { Component } from 'react';
import { Container, Content, StyleProvider } from 'native-base'
import moment from "moment/min/moment-with-locales";
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';

import TopBar from '../../Components/Bars/TopBar'
import RequestsList from '../../Components/Lists/RequestsList'
import answerDialog from '../../Components/Modals/AnswerDialog'
import { withFirebase } from '../../Firebase/index'
import showSnackbar from '../../Components/Modals/Snackbar'

class Swap extends Component {
    constructor(props){
        super(props)
    }

    state = {
        room: {}
    }

    componentDidMount() {
        let user = {}
        user = this.props.navigation.getParam('user', {})
        this.setState({user: user})
        if(user !== {}) {
            this.requestsListener = this.props.firebase
            .getKeyRequestsToUser(user.id)
            .onSnapshot(querySnapshot => {
                const requests = []
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    requests.push({id, ...data})
                });
                this.props.firebase
                .getResourceRequestsToUser(user.id)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const id = doc.id;
                        const data = doc.data();
                        requests.push({id, ...data})
                    });
                    this.setState({requests: requests})
                }, error => {
                    showSnackbar('Algo deu errado. Tente novamente.', 'OK')
                })
            }, error => {
                showSnackbar('Algo deu errado. Tente novamente.', 'OK')
            })
        }
    }

    componentWillUnmount() {
        this.requestsListener()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    answerRequest = (request, type) => {
        if(type == 'key') {
            answerDialog('Responder Solicitação', 
            'Você deseja repassar a ' + request.key + ' para a(o) ' + request.user + '?',
            'Negar',
            this.deleteKeyRequest,
            'Repassar',
            this.acceptKeyRequest,
            request
           )
        } else if(type == 'resource') {
            answerDialog('Responder Solicitação', 
            'Você deseja repassar a(o) ' + request.resource + ' para a(o) ' + request.user + '?',
            'Negar',
            this.deleteResourceRequest,
            'Repassar',
            this.acceptResourceRequest,
            request
           )
        }
    }

    acceptKeyRequest = (request) => {
        const timeFormat = 'HH:mm'
        const dateFormat = 'DD/MM/YYYY'
        const now = moment().format(timeFormat)
        //Criar um objeto empréstimo e coloca-lo na lista
        const loan = {
            date: moment().format(dateFormat),
            key: request.key,
            name: request.user,
            userId: request.userId,
            code: request.code,
            phone: request.phone,
            course: request.course,
            place: request.place,
            loanTime: now,
            devolutionTime: '',
            timestamp: moment().unix(),
            keyId: request.keyId
        }
        this.props.firebase
            .addKeyLoan(loan)
            .then(() => {
                //Chave: Disponível => Indisponível - user: Nome do Usuário
                const id = request.keyId
                const name = request.key
                const place = request.place
                const user = request.user //nome do usuário que pegou a chave
                const userId = request.userId
                const loanId = request.loanId
                const key = {
                    id: id,
                    name: name,
                    place: place,
                    status: false,
                    user: user,
                    userId: userId,
                    loanId: loanId
                }
                this.props.firebase
                    .swapKey(now, key, request.id, this.state.user.id)
                    .then(() => {
                        showSnackbar('Chave repassada com sucesso.', 'OK')
                    })
            })
            .catch(error => {
                showSnackbar('Algo deu errado. Tente novamente.', 'OK')
            })
    }

    acceptResourceRequest = (request) => {
        const timeFormat = 'HH:mm'
        const dateFormat = 'DD/MM/YYYY'
        const now = moment().format(timeFormat)
        //Criar um objeto empréstimo e colocá-lo na lista
        const loan = {
            date: moment().format(dateFormat),
            resource: request.resource,
            name: request.user,
            userId: request.userId,
            code: request.code,
            phone: request.phone,
            course: request.course,
            place: request.place,
            loanTime: now,
            devolutionTime: '',
            timestamp: moment().unix(),
            resourceId: request.resourceId
        }
        this.props.firebase
            .addResourceLoan(loan)
            .then(() => {
                //Chave: Disponível => Indisponível - user: Nome do Usuário
                const id = request.resourceId
                const name = request.resource
                const place = request.place
                const user = request.user //nome do usuário que pegou a chave
                const userId = request.userId
                const loanId = request.loanId
                const resource = {
                    id: id,
                    name: name,
                    place: place,
                    status: false,
                    user: user,
                    userId: userId,
                    loanId: loanId
                }
                this.props.firebase
                    .swapResource(now, resource, request.id, this.state.user.id)
                    .then(() => {
                        showSnackbar('Recurso repassado com sucesso.', 'OK')
                    })
            })
            .catch(error => {
                showSnackbar('Algo deu errado. Tente novamente.', 'OK')
            })
    }

    deleteKeyRequest = (request) => {
        console.log(request.userId)
        this.props.firebase
            .deleteKeyRequestToUser(request.id, this.state.user.id)
    }

    deleteResourceRequest = (request) => {
        this.props.firebase
            .deleteResourceRequestToUser(request.id, this.state.user.id)
    }
    
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <TopBar title="Solicitações"
                            back={this.goBack}/>
                    <Content>
                        <RequestsList requests={this.state.requests} action={this.answerRequest}/>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

export default withFirebase(Swap)