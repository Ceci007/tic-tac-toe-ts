import React, { ReactElement, useRef, useState, useEffect } from "react";
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    TextInput as NativeTextInput,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from "react-native";
import { GradientBackground, TextInput, Button, Text } from "@components";
import { Auth } from "aws-amplify";
import { StackNavigationProp, useHeaderHeight } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "@config/navigator";
import OTPInput from "@twotalltotems/react-native-otp-input";
import { colors, getErrorMessage } from "@utils";
import styles from "./signup.styles";

type SignUpProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "SignUp">;
    route: RouteProp<StackNavigatorParams, "SignUp">;
};

export default function SignUp({ navigation, route }: SignUpProps): ReactElement {
    const unconfirmedUsername = route.params?.username;
    const headerHeight = useHeaderHeight();
    const passwordRef = useRef<NativeTextInput | null>(null);
    const emailRef = useRef<NativeTextInput | null>(null);
    const nameRef = useRef<NativeTextInput | null>(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        name: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"signUp" | "otp">(unconfirmedUsername ? "otp" : "signUp");
    const [confirming, setConfirming] = useState(false);
    const [resending, setResending] = useState(false);

    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const signUp = async () => {
        setLoading(true);
        const { username, password, email, name } = form;

        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    name
                }
            });
            setStep("otp");
        } catch (error) {
            Alert.alert("Error!", getErrorMessage(error));
        }

        setLoading(false);
    };

    const confirmCode = async (code: string) => {
        setConfirming(true);
        try {
            await Auth.confirmSignUp(form.username || unconfirmedUsername || "", code);
            navigation.navigate("Login");
            Alert.alert("Success!", "You can now Login with your account");
        } catch (error) {
            Alert.alert("Error!", getErrorMessage(error));
        }
        setConfirming(false);
    };

    const resendCode = async (username: string) => {
        setResending(true);
        try {
            await Auth.resendSignUp(username);
        } catch (error) {
            Alert.alert("Error!", getErrorMessage(error));
        }
        setResending(false);
    };

    useEffect(() => {
        if (unconfirmedUsername) {
            resendCode(unconfirmedUsername);
        }
    }, []);

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                keyboardVerticalOffset={headerHeight}
                behavior="height"
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {step === "otp" && (
                        <>
                            <Text style={styles.otpText}>
                                Enter the code that you received via email.
                            </Text>
                            {confirming ? (
                                <ActivityIndicator color={colors.lightGreen} />
                            ) : (
                                <View style={{ height: 100 }}>
                                    <OTPInput
                                        placeholderCharacter="0"
                                        placeholderTextColor="#5d5379"
                                        pinCount={6}
                                        codeInputFieldStyle={styles.otpInputBox}
                                        codeInputHighlightStyle={styles.otpActiveInputBox}
                                        onCodeFilled={code => {
                                            confirmCode(code);
                                        }}
                                    />

                                    {resending ? (
                                        <ActivityIndicator color={colors.lightGreen} />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (form.username) {
                                                    resendCode(form.username);
                                                }

                                                if (unconfirmedUsername) {
                                                    resendCode(unconfirmedUsername);
                                                }
                                            }}
                                        >
                                            <Text style={styles.resendLink}>Resend Code</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                    {step === "signUp" && (
                        <>
                            <TextInput
                                value={form.username}
                                onChangeText={value => {
                                    setFormInput("username", value);
                                }}
                                returnKeyType="next"
                                placeholder="Username"
                                style={{ marginBottom: 20 }}
                                onSubmitEditing={() => {
                                    nameRef.current?.focus();
                                }}
                            />
                            <TextInput
                                value={form.name}
                                onChangeText={value => {
                                    setFormInput("name", value);
                                }}
                                ref={nameRef}
                                returnKeyType="next"
                                placeholder="Name"
                                style={{ marginBottom: 20 }}
                                onSubmitEditing={() => {
                                    emailRef.current?.focus();
                                }}
                            />
                            <TextInput
                                keyboardType="email-address"
                                value={form.email}
                                onChangeText={value => {
                                    setFormInput("email", value);
                                }}
                                ref={emailRef}
                                returnKeyType="next"
                                placeholder="Email"
                                style={{ marginBottom: 20 }}
                                onSubmitEditing={() => {
                                    passwordRef.current?.focus();
                                }}
                            />
                            <TextInput
                                value={form.password}
                                onChangeText={value => {
                                    setFormInput("password", value);
                                }}
                                ref={passwordRef}
                                returnKeyType="done"
                                secureTextEntry
                                placeholder="Password"
                                style={{ marginBottom: 30 }}
                            />
                            <Button loading={loading} title="Sign-Up" onPress={signUp} />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}
