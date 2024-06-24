import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { CreateAccountStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { api } from "app/services/api"
import { showMessage } from "react-native-flash-message"

interface SignUpScreenProps extends CreateAccountStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const { authenticationStore } = useStores()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const { navigation } = _props
  const goLogin = () => {
    navigation.navigate("Login")
  }

  const onSignUp = async () => {
    if (email === "" || password === "" || username === "" || fullname === "") {
      showMessage({
        message: "Sign Up failed",
        description: "Please fill all data then try again!",
        type: "danger",
      })
      return 
    }

    const data = {
      username: username,
      password: password,
      email: email,
      fullname: fullname,
      status: "1",
      role: "1"
    }
    const res = await api.register(data)
    
    if (res.kind == "ok") {
      authenticationStore.setUsername(username)
      authenticationStore.setAuthEmail("dktoan14@gmail.com")
      showMessage({
        message: "Sign Up sucessfully",
        description: "Welcome to Fish Farming IOT",
        type: "success",
      })
    } else {
      showMessage({
        message: "Sign Up failed",
        description: "Something went wrong. Please try again!",
        type: "danger",
      })
    }
  }

  return (
    <Screen style={$root} preset="auto" contentContainerStyle={$container} gradientBackground={false}>
      <View style={$headingContainer}>
        <Text preset="heading" text="Sign Up" />
        <Text preset="default" text="Enter your details below & free sign up" />
      </View>
      <View style={$formContainer}>
        <Text text="Your Email" style={$textFormLabel}/>
        <TextField value={email} onChangeText={setEmail} placeholder="Your Email" keyboardType="email-address" autoCapitalize='none'/>
        
        <Text text="Username" style={$textFormLabel}/>
        <TextField value={username} onChangeText={setUsername} placeholder="User Name" autoCapitalize='none'/>

        <Text text="FullName" style={$textFormLabel}/>
        <TextField value={fullname} onChangeText={setFullname} placeholder="Full Name" autoCapitalize='none'/>

        <Text text="Password" style={$textFormLabel}/>
        <TextField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={true} autoCapitalize='none'/>

        <Button preset="filled" text="Create Account" style={$button} onPress={onSignUp}/>
        <View style={{ flexDirection: "row", marginTop: spacing.md}}>
          <TouchableOpacity>
          </TouchableOpacity>
          <Text>By creating an account you have to agree with our them & condition</Text>
        </View>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: spacing.lg}}>
          <Text>Already have an account ? <Text onPress={goLogin} preset="bold" style={{ color: colors.palette.primary100}}>Log in</Text></Text>
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  alignItems: "flex-start",
  backgroundColor: colors.palette.neutral200,
}

const $headingContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xxxl * 2,
  paddingBottom: spacing.lg,
  height: 210,
}

const $formContainer: ViewStyle = {
  flex: 1,
  width: "100%",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
}

const $textFormLabel: TextStyle = {
  marginTop: spacing.lg,
}

const $button: ViewStyle = {
  marginTop: spacing.lg,
}