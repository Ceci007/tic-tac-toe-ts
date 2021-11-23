import { colors } from "@utils";
import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: StatusBar.currentHeight,
        paddingTop: 30
    },
    difficulty: {
        color: colors.lightGreen,
        fontSize: 22,
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5
    },
    results: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 70
    },
    resultsBox: {
        backgroundColor: colors.lightGreen,
        borderWidth: 2,
        borderColor: colors.lightPurple,
        alignItems: "center",
        padding: 15,
        marginHorizontal: 5
    },
    resultsTitle: {
        color: colors.darkPurple,
        fontSize: 14
    },
    resultsCount: {
        color: colors.darkPurple,
        fontSize: 20
    },
    modal: {
        position: "absolute",
        backgroundColor: colors.lightPurple,
        bottom: 40,
        left: 30,
        right: 30,
        padding: 30,
        borderWidth: 3,
        borderColor: colors.lightGreen
    },
    modalText: {
        color: colors.lightGreen,
        fontSize: 28,
        textAlign: "center",
        marginBottom: 30
    }
});

export default styles;
