import React, { useEffect, useState } from 'react';

interface AnalysisResult {
  suggestions: string[];
  completions: string[];
  timestamp: number;
}

interface WebSocketMessage {
  type: string;
  sessionId?: string;
  analysis?: AnalysisResult;
  error?: string;
}

const AIAssistant: React.FC = () => {
  const [socket,  setSocket ] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Generate a unique session ID for this connection
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    // Connect to the WebSocket server
    const ws = new WebSocket(`ws://localhost:3001/ws/${newSessionId}`);
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
      // Request a new session
      ws.send(JSON.stringify({
        type: 'createSession'
      }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      if (message.type === 'sessionCreated') {
        setSessionId(message.sessionId || '');
      } else if (message.type === 'analysisResult' && message.analysis) {
        setAnalysis(message.analysis);
      } else if (message.type === 'error') {
        console.error('WebSocket error:', message.error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const analyzeCode = (code: string, language: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'analyzeCode',
        code,
        language,
        sessionId
      }));
    }
  };

  return (
    <div className="ai-assistant" style={{ padding: '20px' }}>
      <div className="status" style={{ marginBottom: '10px' }}>
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      {analysis && (
        <div className="analysis-results" style={{ 
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Analysis Results</h3>
          {analysis.suggestions.length > 0 && (
            <div className="suggestions">
              <h4>Suggestions</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.completions.length > 0 && (
            <div className="completions">
              <h4>Completions</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {analysis.completions.map((completion, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{completion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 