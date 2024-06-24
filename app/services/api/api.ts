/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async register(data: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {    
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `iot/auth/register`,
      data,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", result: "ok" }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async logIn(data: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `iot/auth/login`,
      data,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getPool(params: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `iot/pool/getPoolByUsername`,
      params,
    )
    

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async addNewPool(newPool: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `iot/pool/addNewPool`,
      newPool,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async removePool(username: string, poolId: string): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.delete(
      `iot/pool/${username}/${poolId}`
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  
  async getAllDevice(): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `iot/device/getAllDevice`
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async sendCommand(deviceId: number, commandValue: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `iot/device/sendCommand`, {}, {
        params: {
          deviceId,
          command: commandValue,
        }
      }
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async addDevice(newDevice: any): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `iot/device/addDevice`,
      newDevice,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  
  async removeDevice(username: string, deviceId: string): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.delete(
      `iot/device/delete/${username}/${deviceId}`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getListDeviceByPoolId(username: string, poolId: string): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `iot/device/getListDeviceByPoolId`,
      {
        username,
        poolId,
      }
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getLogDevice(deviceId: string): Promise<{kind: "ok"; result: any} | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `iot/log_device/getLogDevice`,
      {
        type: 2,
        deviceId,
      }
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data;
      return { kind: "ok", result: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

export const api = new Api()
