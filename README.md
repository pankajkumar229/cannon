# AI-Powered Code Assistant Extension

A VSCode extension that provides AI-powered code assistance, similar to Cursor. This extension combines the power of AI with your coding workflow to provide intelligent code completion, suggestions, and assistance.

## Features

- AI-powered code completion
- Intelligent code suggestions
- Context-aware assistance
- Real-time code analysis
- Natural language to code conversion

## Installation

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) (version 1.60.0 or higher)
- [Python](https://www.python.org/) (version 3.8 or higher)
- [pip](https://pip.pypa.io/en/stable/) (Python package manager)

### Development Environment Setup

#### 1. Install NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell configuration
source ~/.zshrc  # or source ~/.bashrc if using bash

# Verify NVM installation
nvm --version
```

#### 2. Install Node.js and npm

```bash
# Install the latest LTS version of Node.js
nvm install --lts

# Set it as default
nvm alias default node

# Verify installations
node --version
npm --version
```

#### 3. Python Backend Setup

```bash
# Navigate to backend directory
cd src/backend

# Create virtual environment
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

### VSCode Extension Installation

There are two ways to install the extension:

#### Method 1: Install from VSIX file (Recommended for end users)

1. Install project dependencies:
   ```bash
   # Install all dependencies including dev dependencies
   npm install
   ```

2. Build the extension package:
   ```bash
   # Create VSIX package
   npm run package
   ```
   This will create a `.vsix` file in the project root.

3. Open VSCode
4. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the command palette
5. Type "Install from VSIX" and select it
6. Navigate to and select the `.vsix` file created in step 2
7. Reload VSCode when prompted

#### Method 2: Install from source (For developers)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ai-code-assistant.git
   cd ai-code-assistant
   ```

2. Install all dependencies including dev dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run compile
   ```

4. Open the project in VSCode:
   ```bash
   code .
   ```

5. Press F5 to start debugging
   - This will open a new VSCode window with the extension loaded
   - The extension will be in development mode

6. To use the extension:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Start AI Code Assistant" and select it
   - The AI assistant panel will open on the right side of the editor

### Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/ai-code-assistant.git
   cd ai-code-assistant
   ```

2. Install all dependencies including dev dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run compile
   ```

4. Run the extension in development mode:
   ```bash
   npm run watch
   ```

5. Press F5 to start debugging the extension

## Running the Complete System

To run the complete system, you need to:

1. Start the Python backend server:
   ```bash
   cd src/backend
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   python main.py
   ```

2. In a separate terminal, run the VSCode extension:
   ```bash
   npm run watch
   ```
   Then press F5 in VSCode to start debugging

3. The system should now be running with:
   - Python backend server on port 3000
   - VSCode extension active
   - WebSocket connection established between frontend and backend

## Project Structure

```
ai-code-assistant/
├── src/
│   ├── backend/           # Python FastAPI backend
│   │   ├── main.py       # Backend server
│   │   └── requirements.txt
│   ├── frontend/         # React frontend
│   │   └── AIAssistant.tsx
│   └── extension/        # VSCode extension
│       └── extension.ts
├── package.json          # Extension manifest
└── README.md            # This file
```

## Configuration

After installation, you can configure the extension by:

1. Opening VSCode settings (`Ctrl+,` or `Cmd+,`)
2. Search for "AI Code Assistant"
3. Configure your preferences:
   - API Key (if required)
   - Model preferences
   - Code style preferences

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
