# Traceform Babel Plugin

## What It Is

The Traceform Babel plugin is a direct bridge from your source code to what actually renders in the browser. It takes your React components and automatically injects a unique identifier when they compile. Simple concept, powerful results.

No more guessing which part of your code creates which UI elements. No more hunting through component hierarchies.

## How It Works

At its core, the plugin does one thing really well, it adds ID markers to your components during build:

1. **AST Traversal** - We hook into Babel's compilation process
2. **Component Detection** - We find React components using naming conventions
3. **ID Generation** - We create a unique ID (`path:ComponentName:0`)
4. **DOM Injection** - We add this as a `data-traceform-id` attribute to your root JSX element

When paired with our VSCode extension and browser extension, these IDs become the magic that lets you jump from code to UI with a single click.

## Setup & Installation

1. Add the plugin to your project:
```
npm install --save-dev @lucidlayer/babel-plugin-traceform
```

2. Enable it in your Babel config (dev only!):
```js
// babel.config.js
module.exports = {
  plugins: [
    process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform'
  ].filter(Boolean)
}
```

3. For Vite projects, it's just as simple:
```js
// vite.config.js
export default {
  plugins: [
    react({
      babel: {
        plugins: [
          process.env.NODE_ENV === 'development' && '@lucidlayer/babel-plugin-traceform'
        ].filter(Boolean)
      }
    })
  ]
}
```

## Key Features

### Smart Component Detection

The plugin recognizes React components across multiple syntax patterns:

```jsx
// We detect all these variations
function Button() { return <button>Click</button> }
const Card = () => <div>Content</div>
const Menu = React.memo(() => <nav>Links</nav>)
```

It identifies components by:
- Looking for uppercase names (React convention)
- Handling HOCs like `React.memo` and `React.forwardRef`
- Finding the root JSX element returned from each component

### Consistent Path Resolution

To ensure IDs work across your team and environments:
- Automatically detects your project root (including monorepos)
- Normalizes paths for cross platform compatibility
- Creates relative paths that match how VSCode identifies files

### Perfect ID Matching

We generate IDs with extreme care to ensure VSCode and your browser see the same thing:
```
src/components/Button.tsx:Button:0
```

This format (`relativePath:ComponentName:InstanceIndex`) creates a perfect match between your source code location and rendered DOM elements.

## Technical Implementation

### Core Logic Flow

```
┌──────────────┐        ┌───────────────┐       ┌────────────────┐       ┌────────────────┐
│ Parse React  │ ─────► │ Find Component│ ────► │ Locate Root    │ ────► │ Generate       │
│ Component    │        │ Definition    │       │ JSX Element    │       │ Tracefotm ID   │
└──────────────┘        └───────────────┘       └────────────────┘       └────────────────┘
                                                                                  │
                                                                                  ▼
┌──────────────┐        ┌───────────────┐       ┌────────────────┐       ┌────────────────┐
│ Output       │ ◄───── │ Generate New  │ ◄──── │ Create JSX     │ ◄──── │ Calculate      │
│ Modified AST │        │ Code          │       │ Attribute Node │       │ Relative Path  │
└──────────────┘        └───────────────┘       └────────────────┘       └────────────────┘
```

The plugin scans for function declarations and arrow functions, verifies they're likely React components, finds their return value, and injects our attribute.

### Workspace Root Detection

For consistent IDs, we find your project root by looking for:
- `lerna.json`, `pnpm-workspace.yaml`, `nx.json` (monorepo markers)
- `package.json` with workspaces field
- `.git` directory (fallback)

Then we calculate all paths relative to this root.

### Example Transformation

From this:
```jsx
function Button(props) {
  return <button className="btn">{props.children}</button>
}
```

To this:
```jsx
function Button(props) {
  return <button className="btn" data-traceform-id="src/components/Button.jsx:Button:0">{props.children}</button>
}
```

The change is minimal but enables the entire Traceform workflow.

## Integration with Traceform

This Babel plugin is one piece of our three-part system:

1. **Babel Plugin** → Injects IDs during build
2. **VSCode Extension** → Finds components and generates matching IDs
3. **Browser Extension** → Highlights elements using these IDs

Together, they create a seamless developer experience where your code and UI are always connected.

## About Traceform

Traceform eliminates the constant context switching between code and UI. We're building tools that make front-end development more intuitive by connecting what you write to what you see.

---

*This plugin is part of the Traceform developer toolset. For more information, visit [traceform github](https://github.com/lucidlayer/traceform)*