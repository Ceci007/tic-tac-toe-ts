import gql from "graphql-tag";
import { GetPlayerQuery } from "@api";

export const getPlayer = gql`
    query GetPlayer(
        $username: String!
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
    ) {
        getPlayer(username: $username) {
            id
            games(limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
                items {
                    game {
                        id
                        initiator
                        owners
                        status
                        turn
                        winner
                        players {
                            items {
                                player {
                                    name
                                    username
                                }
                            }
                        }
                    }
                }
                nextToken
            }
        }
    }
`;

export const onUpdateGameById = gql`
    subscription onUpdateGameById($id: ID!) {
        onUpdateGameById(id: $id) {
            id
            status
            turn
            state
            winner
        }
    }
`;

export const searchPlayers = gql`
    query searchPlayers($limit: Int, $nextToken: String, $searchString: String) {
        searchPlayers(
            limit: $limit
            nextToken: $nextToken
            filter: {
                or: [
                    { username: { matchPhrasePrefix: $searchString } }
                    { name: { matchPhrasePrefix: $searchString } }
                ]
            }
        ) {
            items {
                name
                username
            }
            nextToken
        }
    }
`;

export type PlayerGamesType = Exclude<
    Exclude<
        Exclude<GetPlayerQuery["getPlayer"], null | undefined>["games"],
        null | undefined
    >["items"],
    null | undefined
>;

export type PlayerGameType = Exclude<PlayerGamesType, null | undefined>[0];
