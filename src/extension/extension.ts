import * as vscode from 'vscode';
import * as path from 'path';

let panel: vscode.WebviewPanel | undefined;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
  try {
    console.log('AI Code Assistant: Starting activation...');

    let disposable = vscode.commands.registerCommand('ai-code-assistant.start', () => {
      if (panel) {
        panel.reveal(vscode.ViewColumn.Two);
      } else {
        panel = vscode.window.createWebviewPanel(
          'aiAssistant',
          'AI Code Assistant',
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')]
          }
        );

        const scriptPathOnDisk = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js');
        const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);
        const nonce = getNonce();

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
              h3, h4 { margin-top: 0; }
              ul { padding-left: 20px; }
            </style>
          </body>
          </html>`;

        panel.onDidDispose(() => {
          panel = undefined;
        }, null, context.subscriptions);
      }
    });

    context.subscriptions.push(disposable);

    // Listen for text document changes
    const textDocumentChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === vscode.window.activeTextEditor?.document) {
        const text = event.document.getText();
        const language = event.document.languageId;
        console.log(`AI Code Assistant: Document changed: ${language} file`);
      }
    });

    context.subscriptions.push(textDocumentChangeDisposable);

    console.log('AI Code Assistant: Activation completed successfully');
    vscode.window.showInformationMessage('AI Code Assistant: Activation completed successfully');

  } catch (error) {
    console.error('AI Code Assistant: Error during activation:', error);
    vscode.window.showErrorMessage('Failed to activate AI Code Assistant: ' + error);
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('AI Code Assistant: Extension deactivated');
}