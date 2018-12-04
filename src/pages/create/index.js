import React from 'react';
import {connect} from 'react-redux';
import {onMemoCreated} from '../../ducks';
import MemoCreate from './MemoCreate';

const mapDispatchToProps = {
    onMemoCreated
};

export default connect(null, mapDispatchToProps)(MemoCreate);