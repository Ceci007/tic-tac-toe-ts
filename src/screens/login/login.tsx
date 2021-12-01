import React, { ReactElement, useRef, useState } from "react";
import { ScrollView, TextInput as NativeTextInput, Alert } from "react-native";
import { GradientBackground, TextInput, Button } from "@components";
import { Auth } from 'aws-amplify';
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import styles from "./login.styles";

type LoginProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Login">;
};

export default function Login({ navigation }: LoginProps): ReactElement {
    const passwordRef = useRef<NativeTextInput | null>(null);
    const [form, setForm] = useState({
      username: "",
      password: "", 
    });
    const [loading, setLoading] = useState(false);

    const setFormInput = (key: keyof typeof form, value: string) => {
      setForm({ ...form, [key]: value });
    }

    const login = async () => {
      setLoading(true);
      const { username, password } = form;
      
      try {
        await Auth.signIn(username, password);
        navigation.navigate("Home");
      } catch(error) {
        Alert.alert("Error!", error.message || "An error has occurred!");
      }
      
      setLoading(false);
    }

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    value={form.username}
                    onChangeText={(value) => {
                      setFormInput("username", value);
                    }}
                    returnKeyType="next"
                    placeholder="Username"
                    style={{ marginBottom: 20 }}
                    onSubmitEditing={() => {
                        passwordRef.current?.focus();
                    }}
                />
                <TextInput
                    value={form.password}
                    onChangeText={(value) => {
                      setFormInput("password", value);
                    }}
                    ref={passwordRef}
                    returnKeyType="done"
                    secureTextEntry
                    placeholder="Password"
                    style={{ marginBottom: 30 }}
                />
                <Button loading={loading} title="Login" onPress={login} />
            </ScrollView>
        </GradientBackground>
    );
}
