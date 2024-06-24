import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  ViewStyle,
} from "react-native"
import {
  Button,
  Screen,
} from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { useStores } from "app/models"

export const ProfileScreen: FC<DemoTabScreenProps<"Profile">> = observer(  
  function ProfileScreen(_props) {
    const {authenticationStore} = useStores()
    const {navigation} = _props
    const onLogout = () => {
      authenticationStore.logout()
      // navigation.reset("")
    }
    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <Button text="Log out" textStyle={{ color: "black"}} onPress={onLogout}/>
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: 128,
}
// #endregion

// @demo remove-file
