import React, { Component } from 'react'
import { Container, Content, Spinner, Text, ActionSheet, StyleProvider, Toast } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
 
import { withFirebase } from '../Firebase/index'
import TopBar from '../Components/Bars/TopBar'
import Rooms from './HomeTabs/Rooms'
import Keys from './HomeTabs/Keys'
import Resources from './HomeTabs/Resources'
import Login from './HomeTabs/Login'
import Loans from './Admin/Loans'
import Requests from './Admin/Requests'
import BottomBar from '../Components/Bars/BottomBar'
import BottomBarAdmin from '../Components/Bars/BottomBarAdmin'
import confirmationDialog from '../Components/Modals/ConfirmationDialog'
import showSnackbar from '../Components/Modals/Snackbar'
import Loader from '../Components/Loaders/Loader'
import LoaderWithCancel from '../Components/Loaders/LoaderWithCancel'

const INITIAL_STATE = {
    user: 0,
    active: 0,
    email: '',
    password: '',
    error: null,
    isLoading: false,
    loadingText: ''
};

// BOTÕES DA ACTION SHEET DO USUÁRIO COMUM
const USER_BUTTONS = [
    { text: "Solicitações de Chave/Recurso", icon: "swap", page: "Swap", iconColor: "#006CB4" },
    { text: "Alterar Senha", icon: "lock", page: "Password", iconColor: "#006CB4" }, 
    { text: "Sair", icon: "log-out", page: "Logout", iconColor: "#d9534f" },
    { text: "Cancelar", icon: "close", iconColor: "#006CB4" }
  ];
const USER_CANCEL_INDEX = 3;

// BOTÕES DA ACTION SHEET DO ADMIN
const ADMIN_BUTTONS = [
    { text: "Chaves", icon: "key", page: "AdminKeys", iconColor: "#006CB4" },
    { text: "Recursos", icon: "camera", page: "AdminResources", iconColor: "#006CB4" },
    { text: "Alterar Senha", icon: "lock", page: "Password", iconColor: "#006CB4" }, 
    { text: "Sair", icon: "log-out", page: "Logout", iconColor: "#d9534f" },
    { text: "Cancelar", icon: "close", iconColor: "#006CB4" }
  ];
const ADMIN_CANCEL_INDEX = 4;

class Home extends Component {
    constructor(props){
        super(props)
        this.state = { ...INITIAL_STATE }
        this.actionSheet = null
    }

    componentDidMount(){
        // CHECA O TIPO DE USUÁRIO
        if(this.props.firebase.isLogged()){
            this.checkUserType()
        }
    }

    changePage = (page) => {
        // TROCA DE PÁGINA
        if(this.state.active != page) {
            switch(page) {
                case 0:
                    this.setState({active: 0})
                    break;
                case 1:
                    this.setState({active: 1})
                    break;
                case 2:
                    this.setState({active: 2})
                    break;
                case 3:
                    if(this.state.user == 0) {
                        this.setState({active: 3})
                    } else if (this.state.user == 1) {
                        this.showActionSheet(USER_BUTTONS, USER_CANCEL_INDEX)
                    } else if (this.state.user == 2) {
                        this.showActionSheet(ADMIN_BUTTONS, ADMIN_CANCEL_INDEX)
                    }
                    break;
            }
        }
    }

    goToPage = (page, params) => {
        // NAVEGAÇÃO DE PÁGINA
        this.props.navigation.navigate(page, params);
    }

    onLogin = () => {
        const {email, password} = this.state
        this.callLoading('Entrando...', null, null)

        this.props.firebase
          .signIn(email, password)
          .then(() => {
            this.checkUserType()
            showSnackbar('Você entrou com sucesso!', 'OK')
          })
          .catch(error => {
            this.stopLoading()
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
          });
    }

    onLogout = () => {
        confirmationDialog('Sair', 
                    'Tem certeza que deseja deslogar da aplicação?',
                    'Sair',
                    this.logout
                    )
    }

    logout = () => {
        this.props.firebase.signOut()
        .then(() => {
            this.setState({user: 0, active: 0})
            console.log('teste')
            showSnackbar('Você saiu da conta com sucesso!', 'OK')
        })
        .catch(error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK') //Traduzir o erro
        })
    }

    onChangeEmail = event => {
        console.log(event)
        this.setState({email: event});
    };

    onChangePassword = event => {
        this.setState({password: event});
    };

    checkUserType = () => {
        this.listener = this.props.firebase.checkAdmin()
            .onSnapshot(querySnapshot => {
                if (querySnapshot.exists){
                    this.setState({user: 2, active: 0})
                    console.log('admin')
                    const id = querySnapshot.id
                    const data = querySnapshot.data()
                    this.setState({userInfo: {id, ...data}, isLoading: false, loadingText: ''})
                } else {
                    this.props.firebase.getUser()
                        .onSnapshot(querySnapshot => {
                            if (querySnapshot.exists){
                                this.setState({user: 1, active: 0})
                                console.log('user')
                                const id = querySnapshot.id
                                const data = querySnapshot.data()
                                this.setState({userInfo: {id, ...data}, isLoading: false, loadingText: ''})
                            } else {
                                //testar o admin da recepção
                            }
                        })
                }
            }, error => {
                showSnackbar('Algo deu errado. Tente novamente.', 'OK')
            })
    }

    sendEmailToChangePassword = () => {
        confirmationDialog('Alterar Senha', 
                    'Tem certeza que deseja alterar a sua senha atual? Será enviado um email para *****'
                    + this.state.userInfo.email.slice(5)
                    + ' com instruções para alterar sua senha.',
                    'Enviar email',
                    this.resetPassword
                    )
    }

    resetPassword = () => {
        this.props.firebase
        .resetPassword(this.state.userInfo.email)
        .then(() => {
            showSnackbar('Email enviado. Cheque seu email.', 'OK')
        })
        .catch(error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
    }

    showActionSheet = (buttons, cancel) => {
        if(this.actionSheet !== null){
            this.actionSheet._root.showActionSheet(
                {
                  options: buttons,
                  cancelButtonIndex: cancel,
                  title: "Mais Opções"
                },
                buttonIndex => {
                    const page = buttons[buttonIndex].page
                    console.log(page)
                    if(page !== undefined) {
                        if(page == 'Logout') {
                            this.onLogout()
                        } else if(page == 'Password') {
                            this.sendEmailToChangePassword()
                        } else if(page == 'Swap') {
                            this.goToPage(page, {user: this.state.userInfo})
                        } else {
                            this.goToPage(page, {})
                        }
                    }
                }
            )
        }
    }

    callLoading = (loadingText, cancel, target) => {
        this.setState({ isLoading: true,
                        loadingText: loadingText,
                        cancel: cancel,
                        target: target })
    }

    stopLoading = () => {
        this.setState({ isLoading: false,
                        loadingText: '',
                        cancel: '',
                        target: '' })
    }

    render() {
        let topBar = null
        let content = null
        let active = []
        console.log(this.state.active)
        switch(this.state.active) {
            case 0:
                if(this.state.user <= 1) {
                    topBar = <TopBar title="Salas"/>
                    content = <Rooms go={this.goToPage}/>
                } else {
                    topBar = <TopBar title="Pedidos de Empréstimo"
                                     hasTabs/>
                    content = <Requests/>
                }
                active = [true, false, false, false]
                break;
            case 1:
                if(this.state.user <= 1) {
                    topBar = <TopBar title="Chaves" hasTabs/>
                    content = <Keys user={this.state.user}
                                    userInfo={this.state.userInfo}
                                    changePage={this.changePage}
                                    loading={this.callLoading}
                                    cancelLoading={this.stopLoading}/>
                } else {
                    topBar = <TopBar title="Empréstimos"
                                     hasTabs/>
                    content = <Loans/>
                }
                active = [false, true, false, false]
                break;
            case 2:
                if(this.state.user <= 1) {
                    topBar = <TopBar title="Recursos" hasTabs/>
                    content = <Resources user={this.state.user}
                                         userInfo={this.state.userInfo}
                                         changePage={this.changePage}
                                         loading={this.callLoading}
                                         cancelLoading={this.stopLoading}/>
                } else {
                    topBar = <TopBar title="Salas"/>
                    content = <Rooms go={this.goToPage}/>
                }
                
                active = [false, false, true, false]
                break;
            case 3:
                active = [false, false, false, true]
                if(this.state.user == 0) {
                    topBar = <TopBar title="Login"/>
                    content =   <Login email={this.state.email}
                                       password={this.state.password}
                                       error={this.state.error}
                                       onChangeEmail={this.onChangeEmail}
                                       onChangePassword={this.onChangePassword}
                                       onLogin={this.onLogin}/>
                }
                break;
        }

        // Checa se está carregando ou não
        let container = null

        if(!this.state.isLoading) {
            if(this.state.user <= 1) {
                container = <Container>
                                {topBar}
                                <Content>{content}</Content>
                                <BottomBar  action={this.changePage}
                                            active={active}
                                            user={this.state.user}/>
                                <ActionSheet style={{backgroundColor: '#212121'}} ref={(c) => { this.actionSheet = c; }} />
                            </Container>
            } else {
                container = <Container>
                                {topBar}
                                <Content>{content}</Content>
                                <BottomBarAdmin action={this.changePage}
                                                active={active}
                                                user={this.state.user}/>
                                <ActionSheet style={{backgroundColor: '#212121'}} ref={(c) => { this.actionSheet = c; }} />
                            </Container>
            }
            
        } else {
            if(this.state.cancel == null) {
                container = <Loader text={this.state.loadingText}/>
            } else {
                container = <LoaderWithCancel text={this.state.loadingText} cancel={this.state.cancel} target={this.state.target}/>
            }
        }

        return <StyleProvider style={getTheme(material)}>{container}</StyleProvider>
    }
}

export default withFirebase(Home)