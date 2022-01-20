import React, { useEffect, ReactElement, useState } from "react";
import { Alert, View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { API, graphqlOperation } from "aws-amplify";

import { Button, GradientBackground, Text } from "@components";
import { GetPlayerQuery } from "@api";
import styles from "./multiplayer-home.styles";
import { useAuth } from "@contexts/auth-context";
import { colors } from "@utils";

import { GraphQLResult } from "@aws-amplify/api";
import { getPlayer, PlayerGameType } from "./multiplayer-home.graphql";
import { TouchableOpacity } from "react-native-gesture-handler";
import GameItem from "./game-item";

export default function MultiplayerHome(): ReactElement {
    const { user } = useAuth();
    const [playerGames, setPlayerGames] = useState<PlayerGameType[] | null>(null);
    const [nextToken, setNextToken] = useState<string | null | undefined>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPlayer = async (nextToken: string | null | undefined, init = false) => {
        if (user) {
            setLoading(true);
            if (nextToken === null && !init) {
                setRefreshing(true);
            }
            try {
                const player = (await API.graphql(
                    graphqlOperation(getPlayer, {
                        username: user.username,
                        limit: 3,
                        nextToken: nextToken,
                        sortDirection: "DESC"
                    })
                )) as GraphQLResult<GetPlayerQuery>;
                if (player.data?.getPlayer?.games) {
                    const newPlayerGames = player.data.getPlayer.games.items || [];
                    setPlayerGames(
                        !playerGames || nextToken === null
                            ? newPlayerGames
                            : [...playerGames, ...newPlayerGames]
                    );
                    setNextToken(player.data.getPlayer.games.nextToken);
                }
            } catch (error) {
                console.log(error);
                Alert.alert("Error!", "An error has occurred!");
            }
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlayer(null, true);
    }, []);

    return (
        <GradientBackground>
            {user ? (
                <>
                    <FlatList
                        contentContainerStyle={styles.container}
                        data={playerGames}
                        renderItem={({ item }) => <GameItem playerGame={item} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    fetchPlayer(null);
                                }}
                                tintColor={colors.lightGreen}
                            />
                        }
                        keyExtractor={playerGame =>
                            playerGame ? playerGame.game.id : `${new Date().getTime()}`
                        }
                        ListFooterComponent={() => {
                            if (!nextToken) return null;
                            return (
                                <Button
                                    style={{ marginTop: 20 }}
                                    loading={loading && !refreshing}
                                    title="Load More"
                                    onPress={() => {
                                        fetchPlayer(nextToken);
                                    }}
                                />
                            );
                        }}
                        ListEmptyComponent={() => {
                            if (loading) {
                                return (
                                    <View style={styles.loading}>
                                        <ActivityIndicator color={colors.lightGreen} />
                                    </View>
                                );
                            }

                            return (
                                <View>
                                    <Text style={{ color: colors.lightGreen }}>No Games Yet</Text>
                                </View>
                            );
                        }}
                    />
                    <TouchableOpacity style={styles.newGameButton}>
                        <Text style={styles.newGameButtonText}>New Game</Text>
                    </TouchableOpacity>
                </>
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