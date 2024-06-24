import React from 'react'

import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { LoginScreen, OnboardingScreen, SignUpScreen } from 'app/screens';

export type CreateAccountNavigatorStackParamList = {
  Onboarding: undefined,
  SignUp: undefined,
  Login: undefined,
}

export type CreateAccountStackScreenProps<T extends keyof CreateAccountNavigatorStackParamList> = NativeStackScreenProps<
  CreateAccountNavigatorStackParamList,
  T
>

const Stack = createNativeStackNavigator<CreateAccountNavigatorStackParamList>();

export const CreateAccountNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Onboarding'>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );  
};
