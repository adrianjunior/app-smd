import React, { Component } from 'react'
import { Tab, Tabs, ScrollableTab, Spinner, Text, Button, Content } from 'native-base'
import moment from "moment/min/moment-with-locales";

import TopBar from '../../Components/Bars/TopBar'
import ResourcesList from '../../Components/Lists/ResourcesList'
import loanDialog from '../../Components/Modals/LoanDialog'
import loginDialog from '../../Components/Modals/LoginDialog'
import { withFirebase } from '../../Firebase/index'

class Resources extends Component {
    constructor(props){
        super(props)
    }

    state = {
        user: 0,
        active: 0,
        isLoading: false,
        isWaiting: false
    }

    componentDidMount() {
        this.listener = this.props.firebase.getResources()
            .onSnapshot(querySnapshot => {
                const resources = []
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    if(data.status === "false") {
                        data.status = false
                    }
                    if(data.status === "true") {
                        data.status = true
                    }
                    if(resources[data.place] == undefined){
                        resources[data.place] = []
                    }
                    resources[data.place].push({id, ...data})
                });
                this.setState({resources: resources})
        }, error => {
            this.setState({ error });
        })
    }

    componentWillUnmount() {
        this.listener()
    }

    onClickResource = (resource) => {
        if(this.props.user == 1){
            /*
                1. User clica no recurso
                2. Aparece um dialog de confirmação
                3. User confirma
                4. Aparece uma SnackBar confirmando
                5. User espera
            */
            loanDialog('Solicitar empréstimo de recurso', 
                       'Deseja solicitar o empréstimo da(o) ' + resource.name + '?',
                       'Solicitar',
                       this.requestLoan,
                       resource,
                       0)
        } else if(this.props.user == 0){
            //Caso não logado, ir para a página de login (função na home)
            loginDialog('Usuário não logado', 
                       'Você precisa estar logado para poder solicitar o empréstimo de chaves e recursos. Deseja ir para página de login?',
                       'Ir para Login',
                       this.props.changePage)
        }
    }

    requestLoan = (resource, target) => {
        const userInfo = this.props.userInfo
        const request = {
            user: userInfo.name,
            userId: userInfo.id,
            course: userInfo.course,
            phone: userInfo.phone,
            code: userInfo.code,
            resource: resource.name,
            place: resource.place,
            resourceId: resource.id,
            timestamp: moment().unix()
        }
        if(target == 0) {
            this.setState({resourcePlace: resource.place})
            this.props.firebase.addResourceRequest(request, resource.place)
            .then(request => {
                this.setState({isWaiting: true, requestId: request.id, target: target})
                this.checkRequestAnswered(target)
            })
        } else if (target == 1){
            this.setState({resourceUserId: resource.userId})
            request.loanId = resource.loanId
            this.props.firebase.addResourceRequestToUser(request, resource.userId)
            .then(request => {
                this.setState({isWaiting: true, requestId: request.id, target: target})
                this.checkRequestAnswered(target)
            })
        }
    }

    cancelRequest = (target) => {
        if(target == 0) {
            this.props.firebase.deleteResourceRequest(this.state.requestId, this.state.resourcePlace)
            .then(() => {
                this.setState({isWaiting: false, requestId: false, target: null, resourceUserId: null})
                this.requestListener()
            })
        } else if (target == 1){
            this.props.firebase.deleteResourceRequestToUser(this.state.requestId, this.state.resourceUserId)
            .then(() => {
                this.setState({isWaiting: false, requestId: false, target: null, resourceUserId: null})
                this.requestListener()
            })
        }
    }

    checkRequestAnswered = (target) => {
        if(target == 0) {
            this.requestListener = this.props.firebase.getResourceRequest(this.state.requestId, this.state.resourcePlace)
            .onSnapshot(querySnapshot => {
                if(!querySnapshot.exists) {
                    this.setState({isWaiting: false, requestId: false, resourcePlace: null})
                    this.requestListener()
                    //Resposta da solicitação
                }
            })
        } else if (target == 1){
            this.requestListener = this.props.firebase.getResourceRequestToUser(this.state.requestId, this.state.resourceUserId)
            .onSnapshot(querySnapshot => {
                if(!querySnapshot.exists) {
                    this.setState({isWaiting: false, requestId: false, resourceUserId: null})
                    this.requestListener()
                    //Resposta da solicitação
                }
            })
        }
    }

    swapUsers = (resource) => {
        if(resource.user !== undefined && resource.userId !== this.props.userInfo.id) {
            loanDialog('Solicitar empréstimo de recurso ocupado', 
                       'Deseja solicitar o empréstimo da(o) ' + resource.name + ' para o usuário ' + resource.user + '?',
                       'Solicitar',
                       this.requestLoan,
                       resource,
                       1)
        } 
    }

    render() {
        let content = null
        let placesTabs = []
        if(this.state.resources != undefined) {
            const resources = this.state.resources
            const places = Object.keys(resources)

            placesTabs = places.map(place => (
                <Tab heading={place}>
                    <Content>
                        <ResourcesList resources={resources[place]}
                                    loan={this.onClickResource}
                                    swap={this.swapUsers}/>
                    </Content>
                </Tab>
            ))
        }

        if(!this.state.isWaiting) {
            if(placesTabs.length > 0){
                content =   <Tabs renderTabBar={()=> <ScrollableTab style={{ backgroundColor: '#FFF' }}/>}>
                                {placesTabs}
                            </Tabs>
            }
        } else {
            content =   <>
                            <Spinner/>
                            <Text>Esperando Confirmação</Text>
                            <Button onPress={() => this.cancelRequest(this.state.target)} danger><Text> Cancelar Solicitação </Text></Button>
                        </>
        }

        return (
            content
        )
    }
}

export default withFirebase(Resources)