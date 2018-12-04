import React, {Component} from 'react';
import {ActivityIndicator, View, Button, Text, FlatList, StyleSheet} from 'react-native';

class MemoHome extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home',
            headerRight: (
                <Button
                    onPress={() => navigation.navigate('Create')}
                    title="+  "
                    color="#000000"
                />
            )
        }
    };

    componentDidMount() {
        this.props.listMemos('');
    }

    renderItem = ({item}) => (
        <View style={styles.item}>
            <Text>{item.description}</Text>
            <Text style={styles.with}>{item.with}</Text>
        </View>
    );

    render() {
        const {memos, state} = this.props;

        if (state === 'LOADING') {
            return (
                <View style={styles.container}>
                    <ActivityIndicator style={styles.activityIndicator}/>
                </View>
            );
        }

        return (
            <FlatList
                styles={styles.container}
                data={memos}
                renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    description: {

    },
    with: {
        marginTop: 4,
        color: 'rgb(100,100,100)'

    }
});

export default MemoHome;

