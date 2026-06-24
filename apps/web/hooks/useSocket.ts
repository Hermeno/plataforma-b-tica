'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'

let socket: Socket | null = null

export function useSocket() {
  const { accessToken, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
        auth: { token: accessToken },
        transports: ['websocket'],
        autoConnect: true,
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [isAuthenticated, accessToken])

  return socket
}
