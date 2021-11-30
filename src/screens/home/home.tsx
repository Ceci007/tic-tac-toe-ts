import React, { ReactElement } from "react";
import { View, Image, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "./home.styles";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Button } from "@components";

type HomeProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <Image style={styles.logo} source={require("@assets/logo.png")} />
                <View style={styles.buttons}>
                    <Button
                        onPress={() => {
                            navigation.navigate("SinglePlayerGame");
                        }}
                        style={styles.button}
                        title="Single Player"
                    />
                    <Button style={styles.button} title="Multiplayer" />
                    <Button
                        onPress={() => {
                            navigation.navigate("Login");
                        }}
                        style={styles.button}
                        title="Login"
                    />
                    <Button
                        onPress={() => {
                            navigation.navigate("Settings");
                        }}
                        style={styles.button}
                        title="Settings"
                    />
                </View>
            </ScrollView>
        </GradientBackground>
    );
}
