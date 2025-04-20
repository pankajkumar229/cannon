import * as vscode from 'vscode';
import * as path from 'path';

let panel: vscode.WebviewPanel | undefined;

async function startAIAssistant(context: vscode.ExtensionContext) {
  if (panel) {
    // If panel exists, reveal it
    panel.reveal(vscode.ViewColumn.Active, true);
  } else {
    // Create the panel in the auxiliary sidebar (right)
    panel = vscode.window.createWebviewPanel(
      'aiAssistant',
      'AI Code Assistant',
      {
        viewColumn: vscode.ViewColumn.Active,
        preserveFocus: true
      },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')]
      }
    );

    const scriptPathOnDisk = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js');
    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

    panel.webview.html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none';
          style-src ${panel.webview.cspSource} 'unsafe-inline';
          script-src ${panel.webview.cspSource} https://unpkg.com 'unsafe-inline';
          connect-src ws://localhost:3000 https://unpkg.com;">
        <title>AI Code Assistant</title>
      </head>
      <body>
        <div id="root"></div>
        <script crossorigin src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
        <script src="${scriptUri}"></script>
        <script>
          try {
            const root = document.getElementById('root');
            console.log('AIAssistant:', window.AIAssistant);
            const App = window.AIAssistant;
            ReactDOM.render(React.createElement(App), root);
          } catch (error) {
            console.error('Error rendering React component:', error);
          }
        </script>
        <style>
          body {
            padding: 0;
            margin: 0;
            height: 100vh;
            overflow: hidden;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          #root {
            height: 100vh;
            overflow-y: auto;
          }
          .ai-assistant {
            padding: 20px;
            height: 100%;
            box-sizing: border-box;
            font-family: var(--vscode-font-family);
          }
          .status {
            margin-bottom: 20px;
            padding: 10px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
          }
          .analysis-results {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 15px;
          }
          h3, h4 { 
            margin-top: 0;
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-font-family);
          }
          ul { 
            padding-left: 20px;
            color: var(--vscode-editor-foreground);
          }
        </style>
      </body>
      </html>`;

    // Handle panel disposal
    panel.onDidDispose(() => {
      panel = undefined;
    }, null, context.subscriptions);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  try {
    console.log('AI Code Assistant: Starting activation...');

    // Register the command
    let disposable = vscode.commands.registerCommand('ai-code-assistant.start', () => {
      startAIAssistant(context);
    });

    context.subscriptions.push(disposable);

    // Automatically start the AI Assistant when the extension activates
    // Add a small delay to ensure VSCode is fully loaded
    setTimeout(() => {
      startAIAssistant(context);
    }, 1000);

  } catch (error) {
    console.error('AI Code Assistant: Error during activation:', error);
    vscode.window.showErrorMessage('Failed to activate AI Code Assistant: ' + error);
  }
}

export function deactivate() {
  console.log('AI Code Assistant: Extension deactivated');
}