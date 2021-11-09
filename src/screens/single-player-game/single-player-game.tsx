import React, { ReactElement } from "react";
import { SafeAreaView } from "react-native";
import styles from "./single-player-game.styles";
import { GradientBackground, Board } from "@components";

export default function Game(): ReactElement {
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Board
                    onCellPressed={index => {
                        alert(index);
                    }}
                    state={["x", "o", null, "x", "o", null, "x", "o", null]}
                    size={300}
                />
            </SafeAreaView>
        </GradientBackground>
    );
}
