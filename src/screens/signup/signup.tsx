import React, { ReactElement, useRef, useState } from "react";
import { 
  ScrollView, 
  KeyboardAvoidingView,
  TextInput as NativeTextInput, 
  Alert 
} from "react-native";
import { GradientBackground, TextInput, Button } from "@components";
import { Auth } from 'aws-amplify';
import { StackNavigationProp, useHeaderHeight } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import styles from "./signup.styles";

type SignUpProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "SignUp">;
};

export default function SignUp({ navigation }: SignUpProps): ReactElement {
    const headerHeight = useHeaderHeight();
    const passwordRef = useRef<NativeTextInput | null>(null);
    const emailRef = useRef<NativeTextInput | null>(null);
    const nameRef = useRef<NativeTextInput | null>(null);

    const [form, setForm] = useState({
      username: "",
      email: "",
      name: "",
      password: "", 
    });
    const [loading, setLoading] = useState(false);

    const setFormInput = (key: keyof typeof form, value: string) => {
      setForm({ ...form, [key]: value });
    }

    const signUp = async () => {
      setLoading(true);
      const { username, password, email, name } = form;
      
      try {
        const res = await Auth.signUp({
          username,
          password,
          attributes: {
            email, 
            name,
          }
        });
        console.log(res);
        //navigation.navigate("Home");
      } catch(error) {
        Alert.alert("Error!", error.message || "An error has occurred!");
      }
      
      setLoading(false);
    }

    return (
        <GradientBackground>
          <KeyboardAvoidingView 
            keyboardVerticalOffset={headerHeight} 
            behavior="height" 
            style={{ flex: 1}}>
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
                        nameRef.current?.focus();
                    }}
                />
                <TextInput
                    value={form.name}
                    onChangeText={(value) => {
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
                    onChangeText={(value) => {
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
                    onChangeText={(value) => {
                      setFormInput("password", value);
                    }}
                    ref={passwordRef}
                    returnKeyType="done"
                    secureTextEntry
                    placeholder="Password"
                    style={{ marginBottom: 30 }}
                />
                <Button loading={loading} title="Sign-Up" onPress={signUp} />
            </ScrollView>
          </KeyboardAvoidingView>
        </GradientBackground>
    );
}
