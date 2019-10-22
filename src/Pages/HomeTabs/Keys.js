import React, { Component } from 'react'
import { Tab, Tabs, ScrollableTab, Spinner, Text, Button, Content } from 'native-base'
import moment from "moment/min/moment-with-locales";

import TopBar from '../../Components/Bars/TopBar'
import ResourcesList from '../../Components/Lists/ResourcesList'
import loanDialog from '../../Components/Modals/LoanDialog'
import loginDialog from '../../Components/Modals/LoginDialog'
import { withFirebase } from '../../Firebase/index'

class Keys extends Component {
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
        this.listener = this.props.firebase.getKeys()
            .onSnapshot(querySnapshot => {
                const keys = []
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    const data = doc.data();
                    if(data.status === "false") {
                        data.status = false
                    }
                    if(data.status === "true") {
                        data.status = true
                    }
                    if(keys[data.place] == undefined){
                        keys[data.place] = []
                    }
                    keys[data.place].push({id, ...data})
                });
                this.setState({keys: keys})
        }, error => {
            this.setState({ error });
        })
    }

    componentWillUnmount() {
        this.listener()
        if(this.requestListener != undefined) {
            this.requestListener()
        }
    }

    onClickKey = (key) => {
        if(this.props.user == 1){
            /*
                1. User clica no recurso
                2. Aparece um dialog de confirmação
                3. User confirma
                4. Aparece uma SnackBar confirmando
                5. User espera
            */
            loanDialog('Solicitar empréstimo de chave', 
                       'Deseja solicitar o empréstimo da ' + key.name + '?',
                       'Solicitar',
                       this.requestLoan,
                       key,
                       0)
        } else if(this.props.user == 0){
            //Caso não logado, ir para a página de login (função na home)
            loginDialog('Usuário não logado', 
                       'Você precisa estar logado para poder solicitar o empréstimo de chaves e recursos. Deseja ir para página de login?',
                       'Ir para Login',
                       this.props.changePage)
        }
    }

    requestLoan = (key, target) => {
        const userInfo = this.props.userInfo
        const request = {
            user: userInfo.name,
            userId: userInfo.id,
            course: userInfo.course,
            phone: userInfo.phone,
            code: userInfo.code,
            key: key.name,
            place: key.place,
            keyId: key.id,
            timestamp: moment().unix()
        }
        if(target == 0) {
            this.setState({keyPlace: key.place})
            this.props.firebase.addKeyRequest(request, key.place)
            .then(request => {
                this.setState({isWaiting: true, requestId: request.id, target: target})
                this.checkRequestAnswered(target)
            })
        } else if (target == 1){
            this.setState({keyUserId: key.userId})
            request.loanId = key.loanId
            this.props.firebase.addKeyRequestToUser(request, key.userId)
            .then(request => {
                this.setState({isWaiting: true, requestId: request.id, target: target})
                this.checkRequestAnswered(target)
            })
        }
    }

    cancelRequest = (target) => {
        if(target == 0) {
            this.props.firebase.deleteKeyRequest(this.state.requestId, this.state.keyPlace)
            .then(() => {
                this.setState({isWaiting: false, requestId: false, target: null, keyPlace: null})
                this.requestListener()
            })
        } else if (target == 1){
            this.props.firebase.deleteKeyRequestToUser(this.state.requestId, this.state.keyUserId)
            .then(() => {
                this.setState({isWaiting: false, requestId: false, target: null, keyUserId: null})
                this.requestListener()
            })
        }
        
    }

    checkRequestAnswered = (target) => {
        if(target == 0) {
            this.requestListener = this.props.firebase.getKeyRequest(this.state.requestId, this.state.keyPlace)
            .onSnapshot(querySnapshot => {
                if(!querySnapshot.exists) {
                    this.setState({isWaiting: false, requestId: false, keyPlace: null})
                    this.requestListener()
                    //Resposta da solicitação
                }
            })
        } else if (target == 1){
            console.log(this.state.keyUserId)
            console.log(this.state.requestId)
            this.requestListener = this.props.firebase.getKeyRequestToUser(this.state.requestId, this.state.keyUserId)
            .onSnapshot(querySnapshot => {
                console.log(querySnapshot)
                if(!querySnapshot.exists) {
                    this.setState({isWaiting: false, requestId: false, keyUserId: null})
                    this.requestListener()
                    //Resposta da solicitação
                }
            })
        }
    }

    swapUsers = (key) => {
        if(key.user !== undefined && key.userId !== this.props.userInfo.id) {
            loanDialog('Solicitar empréstimo de chave ocupada', 
                       'Deseja solicitar o empréstimo da ' + key.name + ' para o usuário ' + key.user + '?',
                       'Solicitar',
                       this.requestLoan,
                       key,
                       1)
        } 
    }

    render() {
        let content = null
        let placesTabs = []
        if(this.state.keys != undefined) {
            const keys = this.state.keys
            const places = Object.keys(keys)

            placesTabs = places.map(place => (
                <Tab heading={place}>
                    <ResourcesList resources={keys[place]}
                                   loan={this.onClickKey}
                                   swap={this.swapUsers}/>
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

export default withFirebase(Keys)