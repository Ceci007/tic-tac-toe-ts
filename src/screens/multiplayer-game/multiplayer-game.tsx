import React, { ReactElement, useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { API, graphqlOperation, loadingSceneName } from "aws-amplify";
import { GradientBackground, Text } from "@components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "@config/navigator";
import { getGame, startGame, playMove } from "./multiplayer-game.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { getGameQuery, startGameMutation } from "@api";
import styles from "./multiplayer-game.styles";

type GameType = getGameQuery["getGame"];

type MultiplayerGameScreenNavigationProp = StackNavigationProp<
    StackNavigatorParams,
    "MultiplayerGame"
>;

type MultiplayerGameScreenRouteProp = RouteProp<StackNavigatorParams, "MultiplayerGame">;

type MultiPlayerGameProps = {
    navigation: MultiplayerGameScreenNavigationProp;
    route: MultiplayerGameScreenRouteProp;
};

export default function MultiplayerGame({ navigation, route }: MultiPlayerGameProps): ReactElement {
    const { gameId: existingGameId, invitee } = route.params;
    const [gameId, setGameId] = useState<string | null>(null);
    const [game, setGame] = useState<GameType | null>(null);
    const [loading, setLoading] = useState(false);

    const initGame = async () => {
        setLoading(true);
        let gameId = existingGameId;
        try {
            if (!gameId) {
                const startGameRes = (await API.graphql(
                    graphqlOperation(startGame, {
                        invitee
                    })
                )) as GraphQLResult<startGameMutation>;

                if (startGameRes.data?.startGame) {
                    //console.log(startGameRes.data.startGame.id);
                    gameId = startGameRes.data.startGame.id;
                }
            }

            if (gameId) {
                const getGameRes = (await API.graphql(
                    graphqlOperation(getGame, {
                        id: gameId
                    })
                )) as GraphQLResult<getGameQuery>;

                if (getGameRes.data?.getGame) {
                    setGame(getGameRes.data?.getGame);
                    setGameId(gameId);
                }
            }
        } catch (error) {
            Alert.alert("Error!", "An error has occurred. Please try again later!");
        }
        setLoading(false);
    };

    useEffect(() => {
        initGame();
    }, []);

    return (
        <GradientBackground>
            <View>
                <Text>asdf</Text>
            </View>
        </GradientBackground>
    );
}
