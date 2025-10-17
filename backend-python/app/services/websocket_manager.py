"""
WebSocket connection manager
"""
from typing import Dict, List, Optional
from fastapi import WebSocket
import json
import asyncio

from app.models.database import User

class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, str] = {}  # user_id -> client_id
        self.conversation_rooms: Dict[str, List[str]] = {}  # conversation_id -> [client_ids]
    
    async def connect(self, websocket: WebSocket, client_id: str, user: Optional[User] = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        
        if user:
            self.user_connections[user.id] = client_id
        
        print(f"✅ WebSocket connected: {client_id} (user: {user.username if user else 'anonymous'})")
    
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        
        # Remove from user connections
        user_id_to_remove = None
        for user_id, conn_id in self.user_connections.items():
            if conn_id == client_id:
                user_id_to_remove = user_id
                break
        
        if user_id_to_remove:
            del self.user_connections[user_id_to_remove]
        
        # Remove from conversation rooms
        for conversation_id, client_ids in self.conversation_rooms.items():
            if client_id in client_ids:
                client_ids.remove(client_id)
        
        print(f"❌ WebSocket disconnected: {client_id}")
    
    async def disconnect_all(self):
        """Disconnect all WebSocket connections"""
        for client_id, websocket in self.active_connections.items():
            try:
                await websocket.close()
            except:
                pass
        
        self.active_connections.clear()
        self.user_connections.clear()
        self.conversation_rooms.clear()
        print("🔌 All WebSocket connections closed")
    
    async def send_personal_message(self, message: dict, client_id: str):
        """Send a message to a specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await websocket.send_json(message)
            except:
                self.disconnect(client_id)
    
    async def send_to_user(self, message: dict, user_id: str):
        """Send a message to a specific user"""
        if user_id in self.user_connections:
            client_id = self.user_connections[user_id]
            await self.send_personal_message(message, client_id)
    
    async def broadcast(self, message: dict, exclude: Optional[str] = None):
        """Broadcast a message to all connected clients"""
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            if exclude and client_id == exclude:
                continue
            
            try:
                await websocket.send_json(message)
            except:
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def join_conversation(self, client_id: str, conversation_id: str):
        """Add client to a conversation room"""
        if conversation_id not in self.conversation_rooms:
            self.conversation_rooms[conversation_id] = []
        
        if client_id not in self.conversation_rooms[conversation_id]:
            self.conversation_rooms[conversation_id].append(client_id)
        
        print(f"👥 Client {client_id} joined conversation {conversation_id}")
    
    async def leave_conversation(self, client_id: str, conversation_id: str):
        """Remove client from a conversation room"""
        if conversation_id in self.conversation_rooms:
            if client_id in self.conversation_rooms[conversation_id]:
                self.conversation_rooms[conversation_id].remove(client_id)
        
        print(f"👋 Client {client_id} left conversation {conversation_id}")
    
    async def broadcast_to_conversation(
        self, 
        conversation_id: str, 
        message: dict, 
        exclude: Optional[str] = None
    ):
        """Broadcast a message to all clients in a conversation"""
        if conversation_id not in self.conversation_rooms:
            return
        
        client_ids = self.conversation_rooms[conversation_id].copy()
        disconnected_clients = []
        
        for client_id in client_ids:
            if exclude and client_id == exclude:
                continue
            
            if client_id in self.active_connections:
                try:
                    await self.active_connections[client_id].send_json(message)
                except:
                    disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self.active_connections)
    
    def get_conversation_participants(self, conversation_id: str) -> List[str]:
        """Get list of client IDs in a conversation"""
        return self.conversation_rooms.get(conversation_id, [])
