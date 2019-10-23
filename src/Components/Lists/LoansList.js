import React from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItem, Text, Body } from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#006CB4',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    }
  });

const loansList = props => {
    let datesList = [] //Lista que vai levar as listas de empréstimos divididos por data
    if(props.loanDates != undefined) {
        Object.values(props.loanDates).forEach((date) => {
            let loansList = []
            date.forEach(loan => {
                if(loansList.length <= 0) {
                    loansList.push(
                        <ListItem itemDivider>
                            <Text>{loan.date}</Text>
                        </ListItem>
                    )   
                }
                if(loan.key !== undefined) { //CHAVE
                    loansList.push(
                        <ListItem button onPress={() => props.action(loan, "key")}>
                            <Body>
                                <Text style={[styles.title, styles.bold]}>{loan.key}</Text>
                                <Text>Data: <Text style={styles.bold}>{loan.date}</Text></Text>
                                <Text>Usuário: <Text style={styles.bold}>{loan.name}</Text></Text>
                                <Text>Código: <Text style={styles.bold}>{loan.code}</Text></Text>
                                <Text>Telefone: <Text style={styles.bold}>{loan.phone}</Text></Text>
                                <Text>Curso: <Text style={styles.bold}>{loan.course}</Text></Text>
                                <Text>Local: <Text style={styles.bold}>{loan.place}</Text></Text>
                                <Text>Saída: <Text style={styles.bold}>{loan.loanTime}</Text></Text>
                                {
                                    loan.devolutionTime !== undefined ?
                                    <Text>Chegada: <Text style={styles.bold}>{loan.devolutionTime}</Text></Text> : null
                                }
                            </Body>
                        </ListItem>
                    )
                } else if(loan.resource !== undefined) { //RECURSO
                    loansList.push(
                        <ListItem button onPress={() => props.action(loan, "resource")}>
                            <Body>
                                <Text style={[styles.title, styles.bold]}>{loan.resource}</Text>
                                <Text>Data: <Text style={styles.bold}>{loan.date}</Text></Text>
                                <Text>Usuário: <Text style={styles.bold}>{loan.name}</Text></Text>
                                <Text>Código: <Text style={styles.bold}>{loan.code}</Text></Text>
                                <Text>Telefone: <Text style={styles.bold}>{loan.phone}</Text></Text>
                                <Text>Curso: <Text style={styles.bold}>{loan.course}</Text></Text>
                                <Text>Local: <Text style={styles.bold}>{loan.place}</Text></Text>
                                <Text>Saída: <Text style={styles.bold}>{loan.loanTime}</Text></Text>
                                {
                                    loan.devolutionTime !== undefined ?
                                    <Text>Chegada: <Text style={styles.bold}>{loan.devolutionTime}</Text></Text> : null
                                }
                            </Body>
                        </ListItem>
                    )
                }
            })
            datesList.push(loansList)
        })
    }
    return(
        <List>
            {datesList}
        </List>
    )
}

export default loansList