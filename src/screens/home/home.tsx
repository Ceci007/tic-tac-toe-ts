import React, { ReactElement } from "react";
import { View, Image, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "./home.styles";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Button, Text } from "@components";
import { useAuth } from "@contexts/auth-context";

type HomeProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
    const { user } = useAuth();

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
                            if(user) {
                                // logout
                            } else {
                                navigation.navigate("Login");
                            }
                        }}
                        style={styles.button}
                        title={ user ? "Logout" : "Login"}
                    />
                    <Button
                        onPress={() => {
                            navigation.navigate("Settings");
                        }}
                        style={styles.button}
                        title="Settings"
                    />
                    { user && 
                    <Text
                        style={styles.loggedInText}
                        weight="400">Logged in as 
                    <Text weight="700"> { user.username }</Text>
                    </Text>}
                </View>
            </ScrollView>
        </GradientBackground>
    );
}
