import React, { ReactElement } from "react";
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import Text from "../text/text";
import { colors } from "@utils";
import styles from "./button.styles";

type ButtonProps = {
    title: string;
    loading?: boolean;
} & TouchableOpacityProps;

export default function Button({ title, loading, style, ...props }: ButtonProps): ReactElement {
    return (
        <TouchableOpacity disabled={loading} {...props} style={[styles.button, style]}>
            { loading ? <ActivityIndicator color={colors.darkPurple} /> 
            : <Text style={styles.buttonText}>{title}</Text>
            }
        </TouchableOpacity>
    );
}
