import { combineReducers } from 'redux';
import draftsSlice from './slices/drafts-slice';
import exampleSlice from './slices/example-slices';

const rootReducer = combineReducers({
    [exampleSlice.name]: exampleSlice.reducer,
    [draftsSlice.name]: draftsSlice.reducer,
});

export default rootReducer;
