import React, { Component } from 'react';
import { Container, Tabs, Tab, ScrollableTab, Content } from 'native-base'
import moment from "moment/min/moment-with-locales";

import TopBar from '../../Components/Bars/TopBar'
import RequestsList from '../../Components/Lists/LoansList';
import answerDialog from '../../Components/Modals/LoanDialog'
import { withFirebase } from '../../Firebase/index'

class Requests extends Component {
    constructor(props){
        super(props)
        this.setState({keys: {}, resources: {}})
    }

    state = {}

    componentDidMount() {
        this.listener = this.props.firebase
        .checkAdmin()
        .onSnapshot(doc => {
          if(doc.exists) {
            const data = doc.data();
            this.setState({place: data.place})
            this.getKeyRequests()
            this.getResourceRequests()
          }
        })
    }

    componentWillUnmount() {
        this.listener()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    getKeyRequests = () => {
        this.props.firebase
        .getKeyRequests(this.state.place)
        .onSnapshot(querySnapshot => {
            const keys = []
            querySnapshot.forEach(doc => {
                const id = doc.id
                const data = doc.data()
                keys.push({id, ...data})
            })
            this.setState({keys: keys})
        }, error => {
            //Snackbar deu errado
        })
    }

    getResourceRequests = () => {
        this.props.firebase
        .getResourceRequests(this.state.place)
        .onSnapshot(querySnapshot => {
            const resources = []
            querySnapshot.forEach(doc => {
                const id = doc.id
                const data = doc.data()
                resources.push({id, ...data})
            })
            this.setState({resources: resources})
        }, error => {
            //Snackbar deu errado
        })
    }

    answerRequest = (request, type) => {
        if(type == 'key') {
            answerDialog('Responder Solicitação', 
            'Você deseja emprestar a ' + request.key + ' para a(o) ' + request.user + '?',
            'Negar',
            this.deleteKeyRequest,
            'Emprestar',
            this.acceptKeyRequest,
            request
           )
        } else if(type == 'resource') {
            answerDialog('Responder Solicitação', 
            'Você deseja emprestar a(o) ' + request.resource + ' para a(o) ' + request.user + '?',
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
        //Criar um objeto empréstimo e colocá-lo na lista
        const loan = {
            date: moment().format(dateFormat),
            key: request.key,
            name: request.user,
            userId: request.userId,
            code: request.code,
            phone: request.phone,
            course: request.course,
            place: request.place,
            loanTime: moment().format(timeFormat),
            devolutionTime: '',
            timestamp: moment().unix(),
            keyId: request.keyId
        }
        this.props.firebase
            .addKeyLoan(loan)
            .then(loan => {
                //Chave: Disponível => Indisponível - user: Nome do Usuário
                const id = request.keyId
                const name = request.key
                const place = request.place
                const user = request.user //nome do usuário que pegou a chave
                const userId = request.userId
                const key = {
                    id: id,
                    name: name,
                    place: place,
                    status: false,
                    user: user,
                    userId: userId,
                    loanId: loan.id
                }
                console.log(key)
                this.props.firebase
                    .updateKey(key)
                    .then(() => {
                        this.deleteKeyRequest(request)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }

    deleteKeyRequest = (request) => {
        this.props.firebase
            .deleteKeyRequest(request.id, request.place)
    }

    acceptResourceRequest = (request) => {
        const timeFormat = 'HH:mm'
        const dateFormat = 'DD/MM/YYYY'
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
            loanTime: moment().format(timeFormat),
            devolutionTime: '',
            timestamp: moment().unix(),
            resourceId: request.resourceId
        }
        this.props.firebase
            .addResourceLoan(loan)
            .then(loan => {
                //Recurso: Disponível => Indisponível - user: Nome do Usuário
                const id = request.resourceId
                const name = request.resource
                const place = request.place
                const user = request.user //nome do usuário que pegou o recurso
                const userId = request.userId
                const resource = {
                    id: id,
                    name: name,
                    place: place,
                    status: false,
                    user: user,
                    userId: userId,
                    loanId: loan.id
                }
                this.props.firebase
                    .updateResource(resource)
                    .then(() => {
                        this.deleteResourceRequest(request)
                    })
                    .catch(error => {
                        //Snackbar deu errado
                    })
            })
            .catch(error => {
                //Snackbar deu errado
            })
    }

    deleteResourceRequest = (request) => {
        this.props.firebase
            .deleteResourceRequest(request.id, request.place)
    }
    
    render() {
        return (
            <Container>
                <TopBar title="Solicitações"
                        back={this.goBack}
                        hasTabs/>
                <Tabs renderTabBar={()=> <ScrollableTab />}>
                    <Tab heading={"Chaves"}>
                        <Content>
                            <RequestsList requests={this.state.keys}
                                          action={this.answerRequest}/>  
                        </Content>
                    </Tab>
                    <Tab heading={"Recursos"}>
                        <Content>
                            <RequestsList requests={this.state.resources}
                                          action={this.answerRequest}/>
                        </Content>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

export default withFirebase(Requests)