import {createMemo as _createMemo, uploadPhoto} from "../api";
import _find from 'lodash/find';

export const GET_MEMOS = 'GET_MEMOS';
export const GET_MEMOS_SUCCESS = 'GET_MEMOS_SUCCESS';
export const GET_MEMOS_FAIL = 'GET_MEMOS_FAIL';

export const CREATE_MEMO = 'CREATE_MEMO';
export const CREATE_MEMO_SUCCESS = 'CREATE_MEMO_SUCCESS';
export const CREATE_MEMO_FAIL = 'CREATE_MEMO_FAIL';

const initialState = {
    memos: [],
    memoHomeState: 'NONE',
};

export default function reducer(state = initialState, action) {
    switch (action.type) {

        //Get Memos
        case GET_MEMOS:
            return {...state, memoHomeState: 'LOADING'};
        case GET_MEMOS_SUCCESS:
            return {...state, memoHomeState: 'SUCCESS', memos: action.payload.data};
        case GET_MEMOS_FAIL:
            return {...state, memoHomeState: 'ERROR'};

        //Create Memo
        case CREATE_MEMO: {
            let memos = state.memos;
            action.memo.uploading = true;
            memos.unshift(action.memo);
            return {...state, memos};
        }
        case CREATE_MEMO_SUCCESS: {
            let memos = state.memos;
            const memo = _find(memos, {localId: action.memo.localId});
            memo.uploading = false;
            return {...state, memos};
        }

        case CREATE_MEMO_FAIL:
            return {};

        default:
            return state;
    }
}

export function fetchMemos(user) {
    return {
        type: GET_MEMOS,
        payload: {
            request: {
                url: `/data/memo`
            }
        }
    };
}

export function createMemo(memo) {
    return async dispatch => {

        memo.localId = Math.random().toString(36).substring(5);

        //Dispatch create memo
        dispatch({
            type: CREATE_MEMO,
            memo,
        });

        //Upload image
        if (memo.imageUri) {
            const imageResponse = await uploadPhoto(memo.imageUri);
            memo.image = imageResponse.data.fileURL;
        }

        //Create memo
        const memoResponse = await _createMemo({
            title: memo.title,
            description: memo.description,
            with: memo.with,
            image: memo.image,
            created: memo.created
        });

        //On memo created
        memoResponse.data.localId = memo.localId;
        memoResponse.data.imageUri = memo.imageUri;
        dispatch({
            type: CREATE_MEMO_SUCCESS,
            memo: memoResponse.data,
        });

    };
}
