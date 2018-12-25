import React, {Component} from 'react';
import {View, Button, Text, TextInput, StyleSheet, TouchableHighlight} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
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

    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            date: null,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({createMemo: this.createMemo});
    }

    render() {
        const dateText = this.state.date ? this.state.date.toLocaleDateString("en-US") : 'Date?';

        return (
            <View style={styles.container}>
                <Toast ref="toast"/>
                <TextInput style={styles.participant} placeholder="Participant"
                           placeholderTextColor="#969696" onChangeText={(participant) => this.setState({participant})}/>
                <TouchableHighlight style={styles.date} activeOpacity={0.9}
                                    onPress={this.showDateTimePicker}><Text style={styles.placeholder}>{dateText}</Text></TouchableHighlight>
                <TextInput style={styles.memo} placeholder="Description" placeholderTextColor="#969696" multiline={true}
                           onChangeText={(memo) => this.setState({memo})}/>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
            </View>
        );
    }

    showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    handleDatePicked = (date) => {
        this.setState({date});
        this.hideDateTimePicker();
    };

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
        height: 50,
        padding: 8
    },
    date: {
        margin: 16,
        marginTop: 4,
        backgroundColor: 'rgb(245,245,245)',
        height: 50,
        padding: 8
    },
    memo: {
        margin: 16,
        marginTop: 4,
        backgroundColor: 'rgb(245,245,245)',
        flex: 1,
        padding: 8
    },
    placeholder: {
        color: 'rgb(150,150,150)'
    }
});

export default MemoCreate;

