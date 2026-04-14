package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/state"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, implement origin check
	},
}

type WSHandler struct {
	redis *state.RedisProvider
}

func NewWSHandler(redis *state.RedisProvider) *WSHandler {
	return &WSHandler{redis: redis}
}

func (h *WSHandler) Handle(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade websocket: %v", err)
		return
	}
	defer conn.Close()

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	var mu sync.Mutex
	subscriptions := make(map[string]context.CancelFunc)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Websocket read error: %v", err)
			break
		}

		var msg struct {
			Type    string          `json:"type"`
			Payload json.RawMessage `json:"payload"`
		}

		if err := json.Unmarshal(message, &msg); err != nil {
			continue
		}

		switch msg.Type {
		case "SUBSCRIBE_ZONE":
			var payload struct {
				ZoneID string `json:"zoneId"`
			}
			if err := json.Unmarshal(msg.Payload, &payload); err == nil {
				mu.Lock()
				if _, ok := subscriptions[payload.ZoneID]; !ok {
					zCtx, zCancel := context.WithCancel(ctx)
					subscriptions[payload.ZoneID] = zCancel
					go h.subscribeToZone(zCtx, conn, payload.ZoneID, &mu)
				}
				mu.Unlock()
			}
		case "AGENT_INTERACTION":
			var payload struct {
				AgentID string `json:"agentId"`
				Message string `json:"message"`
				UserID  string `json:"userId"`
			}
			if err := json.Unmarshal(msg.Payload, &payload); err == nil {
				log.Printf("Received agent interaction for %s: %s", payload.AgentID, payload.Message)
				// In a full implementation, this would forward the request to the services/ai-agent
				// and stream the response back to the client.
			}
		case "GAMBLING_BET":
			log.Printf("Gambling bet received via bridge, routing to Diamond District contracts")
		}
	}
}

func (h *WSHandler) subscribeToZone(ctx context.Context, conn *websocket.Conn, zoneID string, mu *sync.Mutex) {
	pubsub := h.redis.SubscribeZone(ctx, zoneID)
	defer pubsub.Close()

	ch := pubsub.Channel()
	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-ch:
			mu.Lock()
			err := conn.WriteJSON(map[string]interface{}{
				"type":    "ENTITY_STATE",
				"payload": json.RawMessage(msg.Payload),
			})
			mu.Unlock()
			if err != nil {
				return
			}
		}
	}
}
