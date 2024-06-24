import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import {
    Image,
    ImageBackground,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
  ViewStyle,
} from "react-native"
import {
  Button,
  Screen,
  Text,
  TextField,
} from "../components"
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { AntDesign } from "@expo/vector-icons"
import { spacing } from "app/theme"
import { FeedingFishIcon, GradientCardBackground, LightingIcon, OxygenMachineIcon, PumpMachineIcon, TemperatureIcon } from "app/components/ImageResource"
import { Switch } from "react-native-gesture-handler"
import { api } from "app/services/api"
import { Modalize } from "react-native-modalize"
import Picker from "react-native-picker-select"
import { showMessage } from "react-native-flash-message"
import Slider from "@react-native-community/slider"

export const PoolDetailScreen: FC<AppStackScreenProps<"PoolDetail">> = observer(  
  function PoolDetailScreen(_props) {
    const [deviceName, setDeviceName] = useState("")
    const [deviceInfo, setDeviceInfo] = useState("")
    const [selectedDevice, setSelectedDevice] = useState<any>(null)
    const [stateInfoOfDevice, setStateInfoOfDevice] = useState<any>(null)

    const [devices, setDevices] = useState<Array<any>>([])

    const modalizeRef = useRef<Modalize>()
    const childModalizeRef = useRef<Modalize>()

    const {authenticationStore} = useStores()
    const {navigation} = _props

    const { id, name } = _props.route.params
    
    const goBack = () => {
        navigation.goBack()
    }
    
    const openModal = () => {
        if (modalizeRef.current) {
          modalizeRef.current.open();
        }
    }
  
    const closeModal = () => {
        if (modalizeRef.current) {
            modalizeRef.current.close();

        //   setPoolInfo("")
        //   setPoolName("")
        }
    }

    const sendCommand = async (deviceId: number, value: number) => {
        const res = await api.sendCommand(deviceId, value)

        if (res.kind === "ok") {
            console.log({deviceId, value});
            console.log(res);

            if (childModalizeRef.current) {
                childModalizeRef.current.close();
              }
            
            await fetchDevices()
        } else {
            showMessage({
                message: `Some thing go wrong`,
                description: "Please try again!",
                type: "danger",
              })
        }
    }

    const onAddDevice = async () => {
        const data = {
            name: deviceName,
            description: deviceInfo,
            id_pool: id,
            status: 1,
        }

        const res = await api.addDevice(data)
        if (res.kind === "ok") {
            showMessage({
                message: "Add Device success",
                type: "success",
            })
            const newDevice = res.result
            closeModal()
            setDevices([...devices, newDevice])
        } else {
            showMessage({
                message: "Add Device failed",
                description: "Please try again!",
                type: "danger",
              })
            return
        }
    }
    const fetchDevices = async () => {
        const username = authenticationStore.username ?? ""
        const res = await api.getListDeviceByPoolId(username, id)
        if (res.kind === "ok") {
            setDevices(res.result)
        }
    }

    useEffect(() => {
        fetchDevices()
    }, [])

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View style={{flex: 1, flexDirection: "column", width: "100%"}}>
            <View style={{ width: "100%", padding: spacing.lg, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <TouchableOpacity style={{flex: 0.8}} onPress={goBack}>
                    <AntDesign name="arrowleft" size={18} color="white" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', flex: 1, justifyContent: "center", padding: spacing.xs }}>
                    <Text size="md" style={{ color: 'white' }}>{name}</Text>
                </View>
                <TouchableOpacity style={{borderRadius: 15, flex: 0.8}} onPress={openModal}>
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <Text size="xs" style={{color: "#8A8B97"}}>Add Device</Text>
                        <AntDesign name="pluscircleo" size={14} color="#8A8B97"  style={{ marginLeft: spacing.xs}}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
                <View style={{ flexDirection: "row", paddingHorizontal: spacing.md, marginTop: spacing.lg,}}>
                    <Text weight="bold" style={{ color: "white", flex: 1}}>Connected Pools</Text>
                    <TouchableOpacity style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}> 
                        <Text style={{ color: "#8A8B97",}}>See all</Text>
                        <View style={{backgroundColor: "#292637", marginLeft: spacing.xxs, justifyContent: "center", width: 14, height: 14, borderRadius: 3}}>
                            <AntDesign name="arrowright" size={12} color="#8A8B97" />
                        </View>
                    </TouchableOpacity>
                </View>

                {
                    devices.length > 0 && (
                        <View style={$allCardContainer}>
                            {devices.map((item: any, index: number) => (
                                <SensorCard device={item} key={index} modalRef={childModalizeRef} onSelectDevice={(device: any, infoState: any) => {
                                    setSelectedDevice(device)
                                    setStateInfoOfDevice(infoState)
                                }} />
                            ))}
                        </View>
                    )
                }                
            </View>
        </View>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
        >
          <View style={$modalContainer}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Text size="lg" weight="bold">Add Device</Text>
            </View>
            <View style={{ marginVertical: spacing.lg }}>
              <Text text="Type" style={$textFormLabel}/>
              <Picker
                style={{ placeholder: {color: "black", fontSize: 16, marginTop: spacing.md}}}
                value={deviceName}
                onValueChange={(value) => setDeviceName(value ?? "")}
                items={[
                    { label: 'Temperature', value: 'Temperature' },
                    { label: 'Humidity', value: 'Humidity' },
                    { label: 'Feed', value: 'Feed' },
                    { label: 'Light', value: 'Light' },
                    { label: 'Pump', value: 'Pump' },
                ]}
                />
              <Text text="Description" style={$textFormLabel}/>
              <TextField value={deviceInfo} onChangeText={setDeviceInfo} placeholder="Description"/>
            </View>
            <TouchableOpacity style={{paddingHorizontal: spacing.sm, backgroundColor: "#363346",  borderRadius: 8, }} onPress={onAddDevice}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: spacing.sm}}>
                <Text size="sm" style={{color: "#FFFFFF"}}>Add Device</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modalize>
        <Modalize
          ref={childModalizeRef}
          adjustToContentHeight={true}
        >
          <View style={$modalContainer}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Text size="lg" weight="bold">{selectedDevice?.name}</Text>
            </View>

            <View style={{ marginVertical: spacing.lg }}>
                {
                    selectedDevice?.name === "Temperature" ? (
                        <>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Text size="lg">{stateInfoOfDevice}°C</Text>
                            </View>
                            <Slider
                                style={{width: "100%", height: 80, marginVertical: spacing.lg}}
                                minimumValue={20}
                                value={stateInfoOfDevice}
                                maximumValue={40}
                                onValueChange={value => {setStateInfoOfDevice(Math.round(value))}}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                            />
                        </>
                    ) : selectedDevice?.name === "Humidity" ? (
                        <>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Text size="lg">{stateInfoOfDevice}%</Text>
                            </View>
                            <Slider
                                style={{width: "100%", height: 80, marginVertical: spacing.lg}}
                                minimumValue={0}
                                value={stateInfoOfDevice}
                                maximumValue={100}
                                onValueChange={value => {setStateInfoOfDevice(Math.round(value))}}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                            />
                        </>
                    ) : (
                        <>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                                <Text size="lg">{stateInfoOfDevice}h</Text>
                            </View>
                            <Slider
                                style={{width: "100%", height: 80, marginVertical: spacing.lg}}
                                minimumValue={1}
                                value={stateInfoOfDevice}
                                maximumValue={24}
                                onValueChange={value => {setStateInfoOfDevice(Math.round(value))}}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                            />
                        </>
                    )
                }
            </View>

            <TouchableOpacity style={{paddingHorizontal: spacing.sm, backgroundColor: "#363346",  borderRadius: 8, }} onPress={() => {
                sendCommand(selectedDevice.id, stateInfoOfDevice)
            }}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: spacing.sm}}>
                <Text size="sm" style={{color: "#FFFFFF"}}>Xác nhận</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Screen>
    )
  },
)

const SensorCard = (_props: { device: any, modalRef: any, onSelectDevice: any}) => {
    const {device, modalRef, onSelectDevice} = _props

    const openModal = (device: any, stateInfo: any) => {
        if (modalRef?.current) {
            onSelectDevice(device, stateInfo)
            modalRef?.current.open();
        }
    }

    
    const [stateInfo, setStateInfo] = useState<any>(null)
    const [enable, setEnable] = useState<boolean | null>((device.name === "Temperature" || device.name === "Humidity" || device.name === "Feed") ? null : device.status === 1)

    const getStateInfo = async () => {
        if (device.name === "Temperature" || device.name === "Humidity" || device.name === "Feed") {
            const deviceId = device.id                
            const res = await api.getLogDevice(deviceId)
            
            if (res.kind === "ok") {             
                const infoState = res.result[0]?.infor                
                setStateInfo(20)
            }

        }
    }
    useEffect(() => {
        getStateInfo()
    }, [])

    function getIcon(deviceName: string) {{
        switch (deviceName) {
            case "Temperature":
                return TemperatureIcon
              case "Feed":
                  return FeedingFishIcon
              case "Light":
                  return LightingIcon
              case "Pump":
                  return PumpMachineIcon
              case "Humidity":
                return OxygenMachineIcon            
        }
    }}

    const sendCommand = async (deviceId: number, value: number) => {
        if (!(device.name === "Temperature" || device.name === "Humidity" || device.name === "Feed")) {
            setEnable(value === 1)
        }
        const res = await api.sendCommand(deviceId, value)
        if (res.kind === "ok") {
            console.log({deviceId, value});
            console.log(res);
            await getStateInfo();

            //TODO: update
        } else {
            showMessage({
                message: `Some thing go wrong`,
                description: "Please try again!",
                type: "danger",
              })
            if (!(device.name === "Temperature" || device.name === "Humidity" || device.name === "Feed")) {
                setEnable(!(value === 1))
            }
        }
    }

    const nextFix = device.name === "Temperature" ? "°C" : device.name === "Humidity" ? "%" : "h"
    return (
      <TouchableOpacity style={$sensorCardComponent} key={device.id} onPress={() => {openModal(device, stateInfo)}} disabled={!(device.name === "Temperature" || device.name === "Humidity" || device.name === "Feed")}>
        <ScreenBackground
          imageSource={true ? GradientCardBackground: undefined}
          color={false ? "#363346": undefined}
        />
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: spacing.sm,}}>
          <View style={{ width: 48, height: 48, backgroundColor: "white", borderRadius: 999,justifyContent:"center", alignItems: "center"}}>
            <Image resizeMode="contain" style={{ width: 32, height: 32, backgroundColor: "white", borderRadius: 999}} source={getIcon(device.name)}></Image>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end"}}>
            {
                (stateInfo === null && enable !== null) ? (
                    <Switch
                        value={enable}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                        trackColor={{
                            true: "#20202C",
                            false: "#363346"
                        }}
                        onValueChange={(value) => {
                            sendCommand(device.id, value ? 1 : 0)
                        }} 
                    />
                ) : (
                    <Text weight="bold" size="xl" style={{color: "white"}}>{stateInfo}{nextFix}</Text>
                )
            }
          </View>
        </View>
        <Text weight="bold" size="md">{device.name}</Text>
        <Text weight="light" size="xxs">{device.description ??  "    "}</Text>
      </TouchableOpacity>
    )
}

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
  alignItems: "center",
  justifyContent: "flex-start",
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

const $modalContainer: ViewStyle = {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "#b3dbe6"
}

const $textFormLabel: TextStyle = {
    marginTop: spacing.lg,
  }
// #endregion

// @demo remove-file
