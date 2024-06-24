import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageProps, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text, } from "app/components"
import { CreateAccountStackScreenProps } from "app/navigators/CreateAccountNavigator"
import { spacing } from "app/theme"
import Onboarding1Image from "../../../assets/images/onboarding1.png"
import Onboarding2Image from "../../../assets/images/onboarding2.png"
import Onboarding3Image from "../../../assets/images/onboarding3.png"
import PagerView from "react-native-pager-view"

interface OnboardingScreenProps extends CreateAccountStackScreenProps<"Onboarding"> {}

const introData = [
  {
    key: 1,
    title: "Connect",
    description: "Connect all your smart home devices using easiest steps and manage fast",
    image: Onboarding1Image,
  },
  {
    key: 2,
    title: "Control",
    description: "Control your devices from home and abroad or from anywhere in the world and just relax",
    image: Onboarding2Image,
  },
  {
    key: 3,
    title: "Save",
    description: "Track energy consumption every day, ge complete stats, save money",
    image: Onboarding3Image,
  }
]

export const OnboardingScreen: FC<OnboardingScreenProps> = observer(function OnboardingScreen(_props) {
  const { navigation } = _props

  const goSignUp = () => {
    navigation.navigate("SignUp")
  }
  const goLogin = () => {
    navigation.navigate("Login")
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$container} backgroundColor="white" gradientBackground={false}>
      <PagerView style={$viewPager} useNext>
        {introData.map(item => {
          return (
            <View style={$descriptionContainer} key={item.key}>
              <Image source={item.image} style={$image}/>
              <Text style={$text} preset="heading">{item.title}</Text>
              <Text style={$text}>{item.description}</Text>
            </View>
          )
        })}
      </PagerView>
      <View style={$footer}>
        <Button preset="filled" text="Sign up" style={$button} onPress={goSignUp}/>
        <Button text="Log in" style={$button} onPress={goLogin}/>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $viewPager: ViewStyle = {
  flex: 1,
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center"
}

const $container: ViewStyle = {
  flex: 1,
}

const $footer: ViewStyle = {
  width: "100%",
  padding: spacing.lg,
  marginBottom: spacing.xxxl,
  flexDirection: "row",
  justifyContent: "space-between",
}

const $descriptionContainer: ViewStyle = {
  flex: 1,
  marginTop: spacing.xxxl * 2,
  maxWidth: 260,
  alignSelf: "center",
}

const $image: ImageProps = {
  width: 260,
  height: 260,
}

const $text: TextStyle = {
  textAlign: "center"
}

const $button: ViewStyle = {
  flex: 1,
  marginHorizontal: spacing.xs
}

