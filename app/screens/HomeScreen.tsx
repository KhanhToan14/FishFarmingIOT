import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import {
  Screen,
  Text,
  TextField,
} from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { FeedingFishIcon, GradientCardBackground, LightingIcon, OxygenMachineIcon, PumpMachineIcon, TemperatureIcon } from "app/components/ImageResource"
import { spacing } from "app/theme"
import { AntDesign } from "@expo/vector-icons"
import { api } from "app/services/api"
import { useStores } from "app/models"
import { Modalize } from "react-native-modalize"
import { showMessage } from "react-native-flash-message"
import { navigate } from "app/navigators"

export const HomeScreen: FC<DemoTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const [poolName, setPoolName] = useState("")
    const [poolInfo, setPoolInfo] = useState("")

    const [pools, setPools] = useState<Array<any>>([])
    const modalizeRef = useRef<Modalize>()

    const { authenticationStore } = useStores()

    useEffect(() => {
      const fetchPools = async () => {
        const username = authenticationStore.username
        
        const res = await api.getPool({
          username
        })
        if (res.kind === "ok") {
          setPools(res.result)
        }
      }

      fetchPools()
    }, [])

    const postAddPool = async () => {
      const data = {
        name: poolName,
        description: poolInfo,
        id_user: authenticationStore.userId,
        username: authenticationStore.username,
      }

      console.log(data);
      

      const res = await api.addNewPool(data)
      console.log(res);
      
      
      if (res.kind === "ok") {
        showMessage({
          message: "Add Pool success",
          type: "success",
        })
        const newPool = res.result
        closeModal()
        setPools([...pools, newPool])
        
      } else {
        showMessage({
          message: "Add Pool failed",
          description: "Please try again!",
          type: "danger",
        })
        return
      }      
    }

    const openModal = () => {
      if (modalizeRef.current) {
        modalizeRef.current.open();
      }
    }

    const closeModal = () => {
      if (modalizeRef.current) {
        modalizeRef.current.close();

        setPoolInfo("")
        setPoolName("")
      }
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ScrollView>
          <View style={{justifyContent: "flex-end", flexDirection: "row", width: "auto", paddingHorizontal: spacing.lg}}>
            <Image
              width={40}
              height={40}
              style={{ borderColor: "white", borderRadius: 999, borderWidth: 1}}
              source={{ uri: "https://avatar.iran.liara.run/public/boy?username=Ash"}}
            />
          </View>
          <View style={{marginTop: spacing.md, padding: spacing.lg, flexDirection: "row"}}>
            <View style={{flex: 1}}>
              <Text size="xl" weight="bold" style={{color: "white"}}>Hello 👋</Text>
              <Text size="xxs" weight="light" style={{color: "#8A8B97"}}>Welcome back to Fish Farming IOT</Text>
            </View>
            <TouchableOpacity style={{paddingHorizontal: spacing.sm, backgroundColor: "#363346",  borderRadius: 15, }} onPress={openModal}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Text size="sm" style={{color: "#8A8B97"}}>Add Pool</Text>
                <AntDesign name="pluscircleo" size={16} color="#8A8B97"  style={{ marginLeft: spacing.xs}}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: spacing.md, marginTop: spacing.lg}}>
            <Text weight="bold" style={{ color: "white", flex: 1}}>Connected Pools</Text>
            {/* <TouchableOpacity style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}> 
              <Text style={{ color: "#8A8B97",}}>See all</Text>
              <View style={{backgroundColor: "#292637", marginLeft: spacing.xxs, justifyContent: "center", width: 14, height: 14, borderRadius: 3}}>
                <AntDesign name="arrowright" size={12} color="#8A8B97" />
              </View>

            </TouchableOpacity> */}
          </View>

          <View style={$poolsContainer}>
            {pools.length > 0 && pools.map((pool, item) => (
              <TouchableOpacity style={{ width: "100%", marginBottom: spacing.md, padding: spacing.md}} key={pool.id} onPress={() => {
                navigate("PoolDetail", { id: pool.id, name: pool.name, describe: pool.description})
              }}>
                <ScreenBackground
                  imageSource={true ? GradientCardBackground: undefined}
                  color={false ? "#363346": undefined}
                />
                {/* Add delete button */}
                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                  <Text style={{ fontSize: 22, fontWeight: "bold"}}>{pool.name}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "400", }}>5 devices connected</Text>
                </View>
                {pool.description && <Text>{pool.description}</Text> }
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
        >
          <View style={$modalContainer}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Text size="lg" weight="bold">Add Pool</Text>
            </View>
            <View style={{ marginVertical: spacing.lg }}>
              <Text text="Name" style={$textFormLabel}/>
              <TextField value={poolName} onChangeText={setPoolName} placeholder="Name"/>
              <Text text="Description" style={$textFormLabel}/>
              <TextField value={poolInfo} onChangeText={setPoolInfo} placeholder="Description"/>
            </View>
            <TouchableOpacity style={{paddingHorizontal: spacing.sm, backgroundColor: "#363346",  borderRadius: 8, }} onPress={postAddPool}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: spacing.sm}}>
                <Text size="sm" style={{color: "#FFFFFF"}}>Add Pool</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Screen>
    )
  },
)


const ScreenBackground = (props: any) => {
  const { imageSource, color } = props;
  if (imageSource) {
    return (
      <ImageBackground source={imageSource} imageStyle={{ borderRadius: 15}} style={StyleSheet.absoluteFill} />
    );
  }
  if (color) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color, borderRadius: 15 }]} />
    );
  }
  return <View />;
};

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "column"
}

const $poolsContainer: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  flexWrap: "wrap",
  padding: spacing.md,
  alignItems: "flex-start",
  marginBottom: spacing.md,
}

const $allCardContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  padding: spacing.xs,
  alignItems: "flex-start",
}

const $sensorCardComponent: ViewStyle = {
  width: "45%",
  backgroundColor: "blue",
  borderRadius: 15,
  padding: spacing.sm,
  margin: spacing.xs
}

const $textFormLabel: TextStyle = {
  marginTop: spacing.lg,
}

const $modalContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: "#b3dbe6"
}
// #endregion

// @demo remove-file
