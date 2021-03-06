import React, {Component} from 'react';
import {
    ActivityIndicator,
    Image,
    View,
    Text,
    SectionList,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import {AnimatedBackgroundColorView} from 'react-native-animated-background-color-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {reduce as _reduce, map as _map, sortBy as _sortBy} from 'lodash';
import moment from 'moment';

class MemoHome extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Memos',
            headerRight: (
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Create')}>
                    <View style={{marginRight: 16}}>
                        <MaterialCommunityIcons name="plus" size={24} color="black"/>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    };

    componentDidMount() {
        this.props.fetchMemos('');
    }

    renderItem = ({item}) => {
        const imageUri = item.imageUri || item.image;

        return (
            <View style={styles.item}>
                {imageUri ? <Image style={styles.image} source={{uri: imageUri}}/> : <View/>}
                <Text>{item.description}</Text>
                <Text style={styles.with}>{item.with}</Text>
                {item.uploading ? <View style={styles.overlay}/> : <View/>}
            </View>
        )
    };

    render() {
        const {memos, state} = this.props;

        if (state === 'LOADING') {
            return (
                <View style={styles.container}>
                    <ActivityIndicator style={styles.activityIndicator}/>
                </View>
            );
        }

        const sectionedData = this.getSectionedData(memos);

        return (
            <SectionList
                styles={styles.container}
                renderItem={this.renderItem}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                sections={sectionedData}
                keyExtractor={(item, index) => item + index}
            />
        );
    }

    getSectionedData = (memos) => {
        memos = _sortBy(memos, memo => memo.created).reverse();

        let result = _reduce(memos, (result, memo) => {
            const date = moment(new Date(memo.created)).format('DD MMMM');
            (result[date] || (result[date] = [])).push(memo);
            return result;
        }, {});

        return _map(result, (value, key) => {
            return {
                title: key,
                data: value
            }
        });
    };

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
    header: {
        fontWeight: 'bold',
        paddingLeft: 12,
        paddingVertical: 8,
        backgroundColor: 'rgb(240,240,240)',
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    image: {
        height: 200,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
    },
    with: {
        marginTop: 5,
        fontSize: 11,
        color: 'rgb(100,100,100)'
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.1,
        backgroundColor: 'gray',
    }
});

export default MemoHome;

