import React, { ReactElement, useEffect, useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { API, graphqlOperation, loadingSceneName } from "aws-amplify";
import { GradientBackground, Text, Board } from "@components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "@config/navigator";
import { getGame, startGame, playMove } from "./multiplayer-game.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { getGameQuery, startGameMutation, playMoveMutation } from "@api";
import { useAuth } from "@contexts/auth-context";
import { colors, BoardState, Moves, getErrorMessage } from "@utils";
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
    const [playingTurn, setPlayingTurn] = useState<Moves | false>(false);

    const { user } = useAuth();

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
            Alert.alert("Error!", getErrorMessage(error));
        }
        setLoading(false);
    };

    const playTurn = async (index: Moves) => {
        setPlayingTurn(index);
        try {
            const playMoveRes = (await API.graphql(
                graphqlOperation(playMove, {
                    index,
                    game: gameId
                })
            )) as GraphQLResult<playMoveMutation>;
            if (game && playMoveRes.data?.playMove) {
                const { status, state, winner, turn } = playMoveRes.data.playMove;
                setGame({ ...game, status, state, winner, turn });
            }
        } catch (error) {
            Alert.alert("Error!", getErrorMessage(error));
        }
        setPlayingTurn(false);
    };

    useEffect(() => {
        initGame();
    }, []);

    return (
        <GradientBackground>
            {loading && (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator color={colors.lightGreen} />
                </View>
            )}
            {game && user && (
                <Board
                    size={300}
                    loading={playingTurn}
                    disabled={game.turn !== user.username || playingTurn !== false}
                    state={game.state as BoardState}
                    onCellPressed={index => {
                        playTurn(index as Moves);
                    }}
                />
            )}
        </GradientBackground>
    );
}
