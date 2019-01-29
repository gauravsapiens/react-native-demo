import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Button,
    ImageBackground,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    InputAccessoryView,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';
import {ImagePicker, Permissions} from 'expo';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {createMemo, uploadPhoto} from '../../api';
import {MaterialIcons} from '@expo/vector-icons';

class MemoCreate extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Create Memo',
            headerRight: (
                <Button
                    onPress={navigation.getParam('createMemo')}
                    title="Done"
                    color="#000000"
                />
            )
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            date: new Date(),
            imageUri: null,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({createMemo: this.createMemo});
    }

    render() {
        const inputAccessoryViewID = 'supportAccessoryView';
        const dateText = this.state.date ? this.state.date.toDateString() : 'Date?';
        const {imageUri} = this.state;

        return (
            <View style={styles.container}>

                <ScrollView>

                    <TouchableHighlight style={styles.dateContainer} onPress={this.showDateTimePicker}
                                        underlayColor="969696">
                        <Text style={styles.date}>{dateText}</Text>
                    </TouchableHighlight>

                    {imageUri != null && <ImageBackground style={styles.image} source={{uri: imageUri}}/>}

                    <TextInput returnKeyLabel={'Next'} returnKeyType={'next'}
                               onSubmitEditing={() => this.nextInputRef.focus()} autoFocus style={styles.participant}
                               placeholder="Participant"
                               placeholderTextColor="#969696"
                               onChangeText={(participant) => this.setState({participant})}/>

                    <TextInput ref={(comp) => this.nextInputRef = comp} style={styles.memo} placeholder="Description"
                               inputAccessoryViewID={inputAccessoryViewID}
                               placeholderTextColor="#969696" multiline={true}
                               onChangeText={(memo) => this.setState({memo})}/>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />

                </ScrollView>

                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <TouchableWithoutFeedback onPress={this.uploadPhoto}>
                        <View style={styles.uploadContainer}>
                            <MaterialIcons name="add-a-photo" size={24} color="#2a7bf6"/>
                            <Text style={{marginLeft: 8, color: "#2a7bf6"}}>Upload Image</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </InputAccessoryView>

            </View>
        );
    }

    showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    handleDatePicked = (date) => {
        this.setState({date});
        this.hideDateTimePicker();
    };

    uploadPhoto = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('You can\'t add image without these permissions');
        }

        const {uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if (uri == null) {
            return;
        }

        this.setState({
            imageUri: uri
        });
    };

    createMemo = () => {
        this.props.createMemo({
            title: 'Random Title',
            description: this.state.memo,
            with: this.state.participant,
            imageUri: this.state.imageUri,
            created: new Date()
        });
        this.props.navigation.goBack();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    dateContainer: {
        margin: 16,
        alignItems: 'center'
    },
    date: {
        color: 'rgb(150,150,150)',
        fontSize: 12
    },
    image: {
        height: 200
    },
    overlay: {
        backgroundColor: '#000000',
        height: 200,
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    participant: {
        marginHorizontal: 16,
        marginTop: 8,
        height: 44,
        color: '#212121',
        fontSize: 18,
        fontWeight: '500'
    },
    memo: {
        marginHorizontal: 16,
        flex: 1,
        color: '#757575',
        fontSize: 14,
        height: 200,
    },
    placeholder: {
        color: 'rgb(150,150,150)'
    },
    uploadContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default MemoCreate;

