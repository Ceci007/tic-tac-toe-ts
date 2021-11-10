import React, { ReactElement } from "react";
import { SafeAreaView } from "react-native";
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from "@components";
import { printFormattedBoard, BoardState, isEmpty, isFull, getAvailableMoves } from "@utils";

export default function Game(): ReactElement {
    const b: BoardState = ["x", "o", "x", "o", "x", null, "o", "x", null];
    printFormattedBoard(b);
    console.log(isEmpty(b));
    console.log(isFull(b));
    console.log(getAvailableMoves(b));
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Board
                    onCellPressed={index => {
                        alert(index);
                    }}
                    state={b}
                    size={300}
                />
            </SafeAreaView>
        </GradientBackground>
    );
}
