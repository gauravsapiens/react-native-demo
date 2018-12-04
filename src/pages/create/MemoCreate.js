import React, {Component} from 'react';
import {View, Button, TextInput, StyleSheet} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import {createMemo} from '../../api';

class MemoCreate extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Create Memo',
            headerRight: (
                <Button
                    onPress={navigation.getParam('createMemo')}
                    title="Save"
                    color="#000000"
                />
            )
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({createMemo: this.createMemo});
    }

    render() {
        return (
            <View style={styles.container}>
                <Toast ref="toast"/>
                <TextInput style={styles.participant} onChangeText={(participant) => this.setState({participant})}/>
                <TextInput style={styles.memo} multiline={true} onChangeText={(memo) => this.setState({memo})}/>
            </View>
        );
    }

    createMemo = () => {
        createMemo({
            title: 'Random Title',
            description: this.state.memo,
            with: this.state.participant
        })
            .then(response => {
                this.props.onMemoCreated(response.data);
                this.refs.toast.show('Memo Created Successfully!');
                this.props.navigation.goBack();
            })
            .catch(error => {
                this.refs.toast.show('Memo Creation Failed!');
            });
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    participant: {
        margin: 16,
        backgroundColor: 'rgb(245,245,245)',
        height: 70,
        padding: 8
    },
    memo: {
        margin: 16,
        marginTop: 4,
        backgroundColor: 'rgb(245,245,245)',
        flex: 1,
        padding: 8
    }
});

export default MemoCreate;

