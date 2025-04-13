# CodeMap Root
timestamp: 2025-04-12T23:59:24Z # Updated timestamp - TASK_008 Completed

## PROJECT_STRUCTURE
code-to-ui-mapper/
  babel-plugin-inject-id/ [TOOLING]
    src/index.ts #BABEL_PLUGIN "Injects data-component attribute" @pattern[BabelVisitor] @index[plugins] @tasks[TASK_001, TASK_008]
    package.json, tsconfig.json, .eslintrc.js, .prettierrc, README.md, jest.config.js, __tests__/index.test.ts # Added test files
  browser-extension/ [BROWSER]
    src/content.ts #EXT_CONTENT "Content script, listens for highlight commands" @pattern[DOMScanner] @index[extensions] @tasks[TASK_002, TASK_008]
    src/overlay.ts #EXT_OVERLAY "Overlay rendering logic" @pattern[OverlayBox] @index[extensions] @tasks[TASK_002]
    src/background.ts #EXT_BG "Background script, WebSocket relay" @pattern[WebSocketRelay] @index[extensions] @tasks[TASK_002]
    src/styles.css # Styling for overlays @tasks[TASK_002]
    manifest.json # Extension manifest @tasks[TASK_002]
    package.json, tsconfig.json, .eslintrc.js, .prettierrc, README.md, package-lock.json # Config files @tasks[TASK_002]
  vscode-extension/ [EDITOR]
    src/extension.ts #VSC_EXT "VS Code extension entry, command registration, integrated server" @pattern[VSCodeCommand] @index[extensions] @tasks[TASK_003, TASK_008]
    src/client.ts #VSC_CLIENT "WebSocket client" @pattern[WebSocketClient] @index[extensions] @tasks[TASK_003, TASK_008]
    src/bridgeServer.ts # Integrated bridge server logic @tasks[TASK_008]
    package.json, tsconfig.json, .eslintrc.js, .prettierrc, README.md, package-lock.json # Config files @tasks[TASK_003]
  local-bridge-server/ [SERVER] #DEPRECATED
    src/index.ts #BRIDGE_SERVER "WebSocket server, relays highlight commands" @pattern[WebSocketServer] @index[servers] @tasks[TASK_004, TASK_008] #DEPRECATED
    package.json, tsconfig.json, .eslintrc.js, .prettierrc, README.md, package-lock.json # Config files @tasks[TASK_004]
  example-react-app/ [APP]
    src/components/Button.tsx #EX_BTN "Reusable Button" @pattern[Component] @index[components] @tasks[TASK_005]
    src/components/Avatar.tsx #EX_AVATAR "Reusable Avatar" @pattern[Component] @index[components] @tasks[TASK_005]
    src/components/Card.tsx #EX_CARD "Reusable Card" @pattern[Component] @index[components] @tasks[TASK_005]
    src/components/Header.tsx #EX_HEADER "Header with Avatar/Button" @pattern[Component] @index[components] @tasks[TASK_005]
    src/components/Footer.tsx #EX_FOOTER "Footer" @pattern[Component] @index[components] @tasks[TASK_005]
    src/pages/Home.tsx #EX_HOME "Home page" @pattern[Page] @index[pages] @tasks[TASK_005]
    src/pages/Profile.tsx #EX_PROFILE "Profile page" @pattern[Page] @index[pages] @tasks[TASK_005]
    src/App.tsx # Main app layout/routing @tasks[TASK_005]
    src/main.tsx # App entry point @tasks[TASK_005]
    src/index.css # Base styles
    vite.config.ts # Vite config with Babel plugin integration @tasks[TASK_005]
    index.html # Main HTML
    package.json, tsconfig.json, .eslintrc.js, .prettierrc, README.md, package-lock.json # Config files @tasks[TASK_005]
  docs/
    README.md
    test_plan_and_deployment.md # Added by TASK_007
  memory_docs/ # Internal documentation and indexes @tasks[TASK_006]
    indexes/ # YAML index files updated by TASK_006
      components_index.yaml
      services_index.yaml
      utils_index.yaml
      models_index.yaml
    tasks/ # Task management files
    # Other core memory docs...
  package.json, tsconfig.base.json, .eslintrc.js, .prettierrc, README.md # Root config

## FLOW_DIAGRAMS

### System Architecture (Updated)
```mermaid
flowchart TD
    VSC[VS Code Extension (incl. Bridge Server)] -- WebSocket --> BE[Browser Extension]
    BE -- DOM Scan (data-component) --> APP[Instrumented React App]
    APP -- Built with --> BABEL[Babel Plugin (Inject ID)]
```

### Highlight Flow (Updated)
```mermaid
sequenceDiagram
    participant Dev as Developer
    participant VSCode as VS Code Extension (incl. Bridge)
    participant Browser as Browser Extension
    participant DOM as React App DOM

    Dev->>VSCode: Right-click "Find in UI"
    VSCode->>VSCode: Process command, get component name
    VSCode->>Browser: Broadcast {component: "Button"} via integrated WebSocket server
    Browser->>DOM: Query [data-component="Button"]
    Browser->>DOM: Overlay highlights
