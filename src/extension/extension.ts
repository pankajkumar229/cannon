import * as vscode from 'vscode';
import AIAssistant from '../frontend/AIAssistant';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function activate(context: vscode.ExtensionContext) {
  console.log('AI Code Assistant extension is now active!');

  // Create and show the AI Assistant panel
  const panel = vscode.window.createWebviewPanel(
    'aiAssistant',
    'AI Code Assistant',
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  // Render the React component in the webview
  panel.webview.html = getWebviewContent();

  // Register command to start the assistant
  let disposable = vscode.commands.registerCommand('ai-code-assistant.start', () => {
    vscode.window.showInformationMessage('AI Code Assistant started!');
  });

  context.subscriptions.push(disposable);

  // Listen for text document changes
  vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document === vscode.window.activeTextEditor?.document) {
      const text = event.document.getText();
      const language = event.document.languageId;
      // Here you would send the code to the backend for analysis
    }
  });
}

function getWebviewContent() {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Code Assistant</title>
      <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/socket.io-client@4.1.2/dist/socket.io.min.js"></script>
      <style>
        .ai-assistant {
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .status {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
        .analysis-results {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 15px;
        }
        h3, h4 {
          margin-top: 0;
        }
        ul {
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const root = document.getElementById('root');
        ReactDOM.render(React.createElement(AIAssistant), root);
      </script>
    </body>
    </html>`;
}

export function deactivate() {
  console.log('AI Code Assistant extension is now deactivated!');
} 