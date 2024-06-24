import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../../components"
import { CreateAccountStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import FacebookIcon from "../../../assets/images/facebook_ic.png"
import GoogleIcon from "../../../assets/images/google_ic.png"
import { useStores } from "app/models"
import { api } from "app/services/api"
import { showMessage } from "react-native-flash-message"

interface LoginScreenProps extends CreateAccountStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { authenticationStore } = useStores()
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const {navigation} = _props
  const goSignUp = () => {
    navigation.navigate("SignUp")
  }
  const onLogin = async () => {
    if (username === "" || password === "") {
      showMessage({
        message: "Login failed",
        description: "Please fill all data then try again!",
        type: "danger",
      })
      return 
    }

    const data = {
      username,
      password,
    }

    const res = await api.logIn(data)
    if (res.kind == "ok") {
      console.log(res.result)
      const email = res.result.email
      const userId = res.result.id
  
      showMessage({
        message: "Login sucessfully",
        description: "Welcome to Fish Farming IOT",
        type: "success",
      })

      authenticationStore.setUsername(username)
      authenticationStore.setUserId(userId)
      authenticationStore.setAuthEmail(email)
    } else {
      showMessage({
        message: "Login failed",
        description: "Please sure username and password correctly",
        type: "danger",
      })
    }
    
  }
  return (
    <Screen style={$root} preset="auto" contentContainerStyle={$container} gradientBackground={false}>
      <View style={$headingContainer}>
        <Text preset="heading" text="Login" />
      </View>
      <View style={$formContainer}>
        <Text text="Your Email" style={$textFormLabel}/>
        <TextField value={username} onChangeText={setUsername} placeholder="Your Email" autoCapitalize='none'/>
        <Text text="Password" style={$textFormLabel}/>
        <TextField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={true} autoCapitalize='none'/>

        <Text style={{ alignSelf: "flex-end", marginTop: spacing.md}}>Forgot password?</Text>

        <Button preset="filled" text="Log In" style={$button} onPress={onLogin}/>
        {/* <View style={{ flexDirection: "row", marginTop: spacing.md}}>
          <Text>By creating an account you have to agree with our them & condition</Text>
        </View> */}
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: spacing.lg}}>
          <Text>Don't have an account? <Text onPress={goSignUp} preset="bold" style={{ color: colors.palette.primary100}}>Sign up</Text></Text>
        </View>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: spacing.lg, flexDirection: "row"}}>
          <View style={{ borderColor: colors.palette.neutral200, borderWidth: 0.6, flex: 1}}></View>
          <Text style={{ paddingHorizontal: spacing.lg}}>Or login with</Text>
          <View style={{ borderColor: colors.palette.neutral200, borderWidth: 0.6, flex: 1}}></View>
        </View>
        <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", marginTop: spacing.lg, flexDirection: "row"}}>
          <TouchableOpacity>
            <Image source={GoogleIcon} style={{ width: 40, height: 40}}/>
          </TouchableOpacity>

          <TouchableOpacity>
            <Image source={FacebookIcon} style={{ width: 40, height: 40}}/>
          </TouchableOpacity>
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
  marginTop: spacing.md,
}