import {AuthStore} from "./auth";

export const authStore = new AuthStore()

export const useStores = () => {
  return {
    authStore
  }
}
