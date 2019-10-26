import React from 'react'
import { StyleSheet, View } from 'react-native'
import {Content, Container, Spinner, Text, Button, Footer} from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#F18C25',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1 
    },
    grow: {
        flexGrow: 1
    }
  });

const loader = props => {
    return(
        <View style={styles.centerContent}>
            <View style={[styles.centerContent, styles.grow]}>
                <Spinner color='#006CB4'/>
                <Text style={[styles.title, styles.bold]}>{props.text}</Text>
            </View>
            <Button block danger onPress={() => props.cancel(props.target)}>
                <Text>Cancelar</Text>
            </Button>
        </View>
    )
}

export default loader