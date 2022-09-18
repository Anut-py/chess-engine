import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./app/slices/boardSlice";
import gameReducer from "./app/slices/gameSlice";

const store = configureStore({
    reducer: {
        board: boardReducer,
        game: gameReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
