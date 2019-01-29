import React from 'react';
import {connect} from 'react-redux';
import {fetchMemos} from '../../ducks/index';
import MemoHome from './MemoHome';

const mapStateToProps = state => {
    let storedMemos = state.memos.map(memo => ({key: memo.id, ...memo}));
    let loadingState = state.memoHomeState;
    return {
        memos: storedMemos,
        state: loadingState
    };
};

const mapDispatchToProps = {
    fetchMemos
};

export default connect(mapStateToProps, mapDispatchToProps)(MemoHome);