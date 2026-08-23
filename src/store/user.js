import { defineStore } from 'pinia'
import { getProfile } from '@/api/auth'
import { getStatistics } from '@/api/message'
import { mapUser } from '@/api/adapters'
import { getToken, setToken, clearToken, getStoredUser, setStoredUser } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: getStoredUser(),
    stats: { applications: 0, favorites: 0, products: 0 },
    initialized: false,
  }),

  getters: {
    isLogin: (state) => !!state.token,
    displayName: (state) => state.userInfo?.name || '未登录',
  },

  actions: {
    async login(res) {
      const user = mapUser(res)
      this.token = res.token
      this.userInfo = user
      setToken(res.token)
      setStoredUser(user)
    },

    async logout() {
      this.token = ''
      this.userInfo = null
      this.stats = { applications: 0, favorites: 0, products: 0 }
      clearToken()
    },

    async fetchProfile() {
      try {
        const profile = mapUser(await getProfile())
        this.userInfo = profile
        setStoredUser(profile)
        return profile
      } catch (e) {
        return this.userInfo
      }
    },

    async fetchStats() {
      try {
        const stats = await getStatistics()
        this.stats = stats
        return stats
      } catch (e) {
        return this.stats
      }
    },
  },
})
