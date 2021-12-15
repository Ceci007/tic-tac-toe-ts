import React, { ReactElement, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { GradientBackground, Text } from "@components";
import { useAuth } from "@contexts/auth-context";
import { colors } from "@utils";
import { getPlayer } from "./multiplayer-home.graphql";
import styles from "./multiplayer-home.styles";

export default function MultiplayerHome(): ReactElement {
    const { user } = useAuth();

    const fetchPlayer = async (nextToken: string | null) => {
        if (user) {
            try {
                const player = await API.graphql(
                    graphqlOperation(getPlayer, {
                        username: user.username,
                        limit: 1,
                        sortDirection: "DESC",
                        nextToken: nextToken
                    })
                );
                console.log(player);
            } catch (error) {
                Alert.alert("Error!", "An error has occurred!");
            }
        }
    };

    useEffect(() => {
        fetchPlayer(null);
    }, []);

    return (
        <GradientBackground>
            {user ? (
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={{ color: colors.lightGreen }}>{user.username}</Text>
                </ScrollView>
            ) : (
                <View style={styles.container}>
                    <Text style={{ color: colors.lightGreen }}>
                        You must be logged in order to play a multiplayer game!
                    </Text>
                </View>
            )}
        </GradientBackground>
    );
}
