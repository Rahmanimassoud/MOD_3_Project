import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'; // Correct the import here
import { persistReducer } from 'redux-persist'; // Correct the import here
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist'; // Correct the import here

const rootReducer = combineReducers({
    user: userReducer, // Use the correct reducer variable name
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Use a different variable name

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);