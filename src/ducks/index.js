export const GET_MEMOS = 'GET_MEMOS';
export const GET_MEMOS_SUCCESS = 'GET_MEMOS_SUCCESS';
export const GET_MEMOS_FAIL = 'GET_MEMOS_FAIL';

export const CREATE_MEMO_SUCCESSFUL = 'CREATE_MEMO_SUCCESSFUL';

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
        case CREATE_MEMO_SUCCESSFUL:
            let memos = state.memos;
            memos.unshift(action.memo);
            return {...state, memos};

        default:
            return state;
    }
}

export function listMemos(user) {
    return {
        type: GET_MEMOS,
        payload: {
            request: {
                url: `/data/memo`
            }
        }
    };
}

export function onMemoCreated(memo) {
    return {
        type: CREATE_MEMO_SUCCESSFUL,
        memo: memo
    };
}
