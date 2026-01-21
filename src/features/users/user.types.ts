export interface User {
    avatarUrl: {
      uid: string,
      originalName?: string,
      publicUrl?: string
    },
    email: string,
    fullName: string,
    phoneNumber: string,
    uid: string
}