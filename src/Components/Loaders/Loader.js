import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Spinner, Text} from 'native-base'

const styles = StyleSheet.create({
    title: {
        color: '#F18C25',
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    }
  });

const loader = props => {
    return(
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Spinner color='#006CB4'/>
            <Text style={[styles.title, styles.bold]}>{props.text}</Text>
        </View>
    )
}

export default loader