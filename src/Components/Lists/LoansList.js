import React from 'react'
import { List, ListItem, Text, Body } from 'native-base'

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
                                <Text>{loan.key}</Text>
                                <Text>{loan.date}</Text>
                                <Text>Usuário: {loan.name}</Text>
                                <Text>Código: {loan.code}</Text>
                                <Text>Telefone: {loan.phone}</Text>
                                <Text>Curso: {loan.course}</Text>
                                <Text>Local: {loan.place}</Text>
                                <Text>Saída: {loan.loanTime}</Text>
                                {
                                    loan.devolutionTime !== undefined ?
                                    <Text>Chegada: {loan.devolutionTime}</Text> : null
                                }
                            </Body>
                        </ListItem>
                    )
                } else if(loan.resource !== undefined) { //RECURSO
                    loansList.push(
                        <ListItem button onPress={() => props.action(loan, "resource")}>
                            <Body>
                                <Text>{loan.resource}</Text>
                                <Text>{loan.date}</Text>
                                <Text>Usuário: {loan.name}</Text>
                                <Text>Código: {loan.code}</Text>
                                <Text>Telefone: {loan.phone}</Text>
                                <Text>Curso: {loan.course}</Text>
                                <Text>Local: {loan.place}</Text>
                                <Text>Saída: {loan.loanTime}</Text>
                                {
                                    loan.devolutionTime !== undefined ?
                                    <Text>Chegada: {loan.devolutionTime}</Text> : null
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