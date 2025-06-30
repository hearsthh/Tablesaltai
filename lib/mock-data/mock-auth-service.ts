// Mock Authentication Service
export const mockAuthService = {
  // Mock user data
  currentUser: {
    id: "user-123",
    email: "owner@spicegarden.com",
    name: "Restaurant Owner",
    role: "owner",
    created_at: "2024-01-01T00:00:00Z",
  },

  // Mock authentication methods
  async getCurrentUser() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { user: this.currentUser, error: null }
  },

  async signIn(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (email === "owner@spicegarden.com" && password === "password") {
      return { user: this.currentUser, error: null }
    }

    return { user: null, error: "Invalid credentials" }
  },

  async signUp(email: string, password: string, userData: any) {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      ...userData,
      created_at: new Date().toISOString(),
    }

    return { user: newUser, error: null }
  },

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { error: null }
  },

  async resetPassword(email: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { error: null }
  },

  async updatePassword(password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { error: null }
  },

  async getUserProfile(userId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (userId === this.currentUser.id) {
      return {
        profile: {
          id: "restaurant-123",
          user_id: userId,
          name: "Spice Garden",
          // ... other profile data
        },
        error: null,
      }
    }

    return { profile: null, error: "Profile not found" }
  },
}
