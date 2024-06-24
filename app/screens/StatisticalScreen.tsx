import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  ScrollView,
  View,
  ViewStyle,
} from "react-native"
import {
  Screen,
} from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"

export const StatisticalScreen: FC<DemoTabScreenProps<"Statistical">> = observer(
  function StatisticalScreen(_props) {
    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ScrollView>
          <View style={{width: "100%", backgroundColor: "white", borderRadius: 20}}>
            <View style={{height: 30}}>

            </View>
          </View>
        </ScrollView>
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}
// #endregion

// @demo remove-file