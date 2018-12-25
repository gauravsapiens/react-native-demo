import React, {Component} from 'react';
import {ActivityIndicator, View, Button, Text, SectionList, StyleSheet} from 'react-native';
import {reduce as _reduce, map as _map, sortBy as _sortBy} from 'lodash';
import moment from 'moment';

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

    getDateLabel = (date) => {
        return moment(date).format('DD MMMM');
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
    description: {},
    with: {
        marginTop: 4,
        color: 'rgb(100,100,100)'

    }
});

export default MemoHome;

