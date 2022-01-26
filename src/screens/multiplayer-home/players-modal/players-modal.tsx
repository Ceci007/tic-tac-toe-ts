import React, { ReactElement, useEffect, useState, useRef } from "react";
import { View, Dimensions, Alert, TextInput as NativeTextInput } from "react-native";
import { GradientBackground, Text, TextInput } from "@components";
import { API, graphqlOperation } from "aws-amplify";
import { searchPlayers } from "../multiplayer-home.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { searchPlayersQuery } from "@api";
import { colors } from "@utils";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

type PlayersListType = Exclude<searchPlayersQuery["searchPlayers"], null | undefined>["items"];

export default function PlayersModal(): ReactElement {
    const [players, setPlayers] = useState<PlayersListType | null>(null);
    const inputRef = useRef<NativeTextInput | null>(null);

    const fetchPlayers = async (searchString: string) => {
        try {
            const players = (await API.graphql(
                graphqlOperation(searchPlayers, {
                    limit: 10,
                    searchString: searchString
                })
            )) as GraphQLResult<searchPlayersQuery>;

            if (players.data?.searchPlayers) {
                setPlayers(players.data.searchPlayers.items);
            }
        } catch (error) {
            Alert.alert("Error!", "An error has occurred. Please try again later!");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, []);

    return (
        <View
            style={{
                height: SCREEN_HEIGHT * 0.6,
                marginTop: SCREEN_HEIGHT * 0.4
            }}
        >
            <GradientBackground>
                <View style={{ padding: 20, backgroundColor: colors.purple }}>
                    <TextInput
                        ref={inputRef}
                        style={{
                            borderBottomWidth: 0,
                            backgroundColor: colors.darkPurple
                        }}
                        placeholder="Type to search by username"
                        returnKeyType="search"
                    />
                </View>
            </GradientBackground>
        </View>
    );
}
