import React, { Component } from 'react';
import { Container, Tabs, Tab, ScrollableTab, Content, StyleProvider, Toast } from 'native-base'
import moment from "moment/min/moment-with-locales";
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';

import TopBar from '../../Components/Bars/TopBar'
import LoansList from '../../Components/Lists/LoansList';
import loanDialog from '../../Components/Modals/LoanDialog'
import { withFirebase } from '../../Firebase/index'
import showSnackbar from '../../Components/Modals/Snackbar'

class LoanHistory extends Component {
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
            this.getKeyLoans()
            this.getResourceLoans()
          }
        })
    }

    componentWillUnmount() {
        this.listener()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    getKeyLoans = () => {
        this.props.firebase
        .getKeyLoans()
        .onSnapshot(querySnapshot => {
            const keys = []
            querySnapshot.forEach(doc => {
                const id = doc.id
                const data = doc.data()
                if(data.status === "false") {
                    data.status = false
                }
                if(data.status === "true") {
                    data.status = true
                }
                if(keys[data.date] == undefined){
                    keys[data.date] = []
                }
                keys[data.date].push({id, ...data})
            })
            this.setState({keys: keys})
        }, error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
    }

    getResourceLoans = () => {
        this.props.firebase
        .getResourceLoans()
        .onSnapshot(querySnapshot => {
            const resources = []
            querySnapshot.forEach(doc => {
                const id = doc.id
                const data = doc.data()
                if(data.status === "false") {
                    data.status = false
                }
                if(data.status === "true") {
                    data.status = true
                }
                if(resources[data.date] == undefined){
                    resources[data.date] = []
                }
                resources[data.date].push({id, ...data})
            })
            this.setState({resources: resources})
        }, error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
    }

    answerLoan = (loan, type) => {
        //Checa se o admin é do mesmo local da chave ou recurso
        console.log(loan.devolutionTime)
        if(loan.place == this.state.place && loan.devolutionTime == ''){ 
            if(type == 'key') {
                loanDialog('Devolver Chave', 
                'Você deseja retornar a ' + loan.key + ' para ' + loan.place + '?',
                'Retornar',
                this.returnKey,
                loan,
                ''
               )
            } else if(type == 'resource') {
                loanDialog('Devolver Recurso', 
                'Você deseja retornar a(o) ' + loan.resource + ' para ' + loan.place + '?',
                'Retornar',
                this.returnResource,
                loan,
                ''
               )
            }
        }
    }

    returnKey = (loan, foo) => {
        //Alterar a chave: Indisponível => Disponível - user: deletar
        const now = moment().format('HH:mm')
        this.props.firebase
        .updateKeyDeletingUser(loan.keyId)
        .then(() => {
        //Alterar o devolutionTime do Loan
            this.props.firebase.updateKeyLoan(loan.id, now)
            .then(() => {
                showSnackbar('Chave devolvida com sucesso!.', 'OK')
            })
        })
        .catch(error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
      }
    
      returnResource = (loan, foo) => {
        //Alterar o recurso: Indisponível => Disponível - user: deletar
        const now = moment().format('HH:mm')
        this.props.firebase
        .updateResourceDeletingUser(loan.resourceId)
        .then(() => {
        //Alterar o devolutionTime do Loan
            this.props.firebase.updateResourceLoan(loan.id, now)
            .then(() => {
                showSnackbar('Recurso devolvido com sucesso!.', 'OK')
            })
        })
        .catch(error => {
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
      }
    
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <TopBar title="Empréstimos"
                            back={this.goBack}
                            hasTabs/>
                    <Tabs renderTabBar={()=> <ScrollableTab style={{ backgroundColor: '#FFF' }}/>}>
                        <Tab heading={"Chaves"}>
                            <Content>
                                <LoansList loanDates={this.state.keys}
                                        action={this.answerLoan}/>  
                            </Content>
                        </Tab>
                        <Tab heading={"Recursos"}>
                            <Content>
                                <LoansList loanDates={this.state.resources}
                                        action={this.answerLoan}/>
                            </Content>
                        </Tab>
                    </Tabs>
                </Container>
            </StyleProvider>
        )
    }
}

export default withFirebase(LoanHistory)