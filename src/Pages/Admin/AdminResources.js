import React, { Component } from 'react'
import { Tab, Tabs, ScrollableTab, Spinner, Text, Button, Container, Content, StyleProvider } from 'native-base'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import moment from "moment/min/moment-with-locales";

import TopBar from '../../Components/Bars/TopBar'
import ResourcesList from '../../Components/Lists/ResourcesList'
import loanDialog from '../../Components/Modals/LoanDialog'
import loginDialog from '../../Components/Modals/LoginDialog'
import { withFirebase } from '../../Firebase/index'
import showSnackbar from '../../Components/Modals/Snackbar'

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
            showSnackbar('Algo deu errado. Tente novamente.', 'OK')
        })
    }

    componentWillUnmount() {
        this.listener()
    }

    foo = () => {}

    goBack = () => {
        this.props.navigation.goBack()
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
                                       loan={this.foo}
                                       swap={this.foo}/>
                    </Content>
                </Tab>
            ))
        }

        if(placesTabs.length > 0){
            content =   <Tabs renderTabBar={()=> <ScrollableTab style={{ backgroundColor: '#006CB4' }}/>}>
                            {placesTabs}
                        </Tabs>
        }

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <TopBar title="Recursos" back={this.goBack}/>
                    {content}
                </Container>
            </StyleProvider>
        )
    }
}

export default withFirebase(Resources)