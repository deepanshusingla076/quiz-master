import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function createLeaderboardClient(onMessage: (msg: any) => void) {
  const client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 2000,
    onConnect: () => {
      client.subscribe('/topic/leaderboard', (m) => {
        try { onMessage(JSON.parse(m.body)) } catch { /* ignore */ }
      })
    }
  })
  client.activate()
  return () => client.deactivate()
}


