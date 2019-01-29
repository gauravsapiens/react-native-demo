import React, {Component} from 'react';
import {
    ActivityIndicator,
    View,
    Button,
    ImageBackground,
    Text,
    TextInput,
    StyleSheet,
    InputAccessoryView,
    TouchableHighlight
} from 'react-native';
import {ImagePicker, Permissions} from 'expo';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast, {DURATION} from 'react-native-easy-toast'
import {createMemo, uploadPhoto} from '../../api';

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
            image: null,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({createMemo: this.createMemo});
    }

    render() {
        const inputAccessoryViewID = 'supportAccessoryView';
        const dateText = this.state.date ? this.state.date.toDateString() : 'Date?';
        const {image} = this.state;

        return (
            <View style={styles.container}>
                <Toast ref="toast"/>

                <TouchableHighlight style={styles.dateContainer} activeOpacity={0.9} onPress={this.showDateTimePicker}>
                    <Text style={styles.date}>{dateText}</Text>
                </TouchableHighlight>

                {image != null && <ImageBackground style={styles.image} source={{uri: image.uri}}>
                    {image.uploading ? <View style={styles.overlay}><ActivityIndicator color="white"/></View> : <View/>}
                </ImageBackground>}

                <TextInput returnKeyLabel={'Next'} returnKeyType={'next'}
                           onSubmitEditing={() => this.nextInputRef.focus()} autoFocus style={styles.participant}
                           placeholder="Participant"
                           placeholderTextColor="#969696" onChangeText={(participant) => this.setState({participant})}/>

                <TextInput ref={(comp) => this.nextInputRef = comp} style={styles.memo} placeholder="Description"
                           inputAccessoryViewID={inputAccessoryViewID}
                           placeholderTextColor="#969696" multiline={true}
                           onChangeText={(memo) => this.setState({memo})}/>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />

                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={{backgroundColor: 'white'}}>
                        <Button onPress={this.uploadPhoto} title="Upload Image"/>
                    </View>
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
            image: {uploading: true, uri}
        });

        const response = await uploadPhoto(uri);
        this.setState({
            image: {uploading: false, url: response.data.fileURL, uri}
        });
    };

    createMemo = async () => {
        const response = await createMemo({
            title: 'Random Title',
            description: this.state.memo,
            with: this.state.participant,
            image: this.state.image.url
        });

        this.props.onMemoCreated(response.data);
        this.refs.toast.show('Memo Created Successfully!');
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
        fontSize: 14
    },
    placeholder: {
        color: 'rgb(150,150,150)'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default MemoCreate;

