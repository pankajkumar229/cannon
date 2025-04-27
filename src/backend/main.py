from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
from typing import Dict, Any
import asyncio

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active sessions
sessions: Dict[str, Any] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            if session_id in sessions:
                del sessions[session_id]

    async def send_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "createSession":
                new_session_id = str(uuid.uuid4())
                sessions[new_session_id] = {
                    "created_at": asyncio.get_event_loop().time(),
                    "socket_id": session_id
                }
                await manager.send_message(
                    json.dumps({
                        "type": "sessionCreated",
                        "sessionId": new_session_id
                    }),
                    session_id
                )
            
            elif message["type"] == "analyzeCode":
                try:
                    # Here you would integrate with your AI service
                    analysis = {
                        "suggestions": [],
                        "completions": [],
                        "timestamp": asyncio.get_event_loop().time()
                    }
                    
                    await manager.send_message(
                        json.dumps({
                            "type": "analysisResult",
                            "sessionId": session_id,
                            "analysis": analysis
                        }),
                        session_id
                    )
                except Exception as e:
                    await manager.send_message(
                        json.dumps({
                            "type": "error",
                            "sessionId": session_id,
                            "error": str(e)
                        }),
                        session_id
                    )
    
    except WebSocketDisconnect:
        manager.disconnect(session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001) 