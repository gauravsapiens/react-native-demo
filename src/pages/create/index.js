import React from 'react';
import {connect} from 'react-redux';
import {createMemo} from '../../ducks';
import MemoCreate from './MemoCreate';

const mapDispatchToProps = {
    createMemo
};

export default connect(null, mapDispatchToProps)(MemoCreate);