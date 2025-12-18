# TOONIFY

**Token-Oriented Notation Converter**

A frontend-only web application that converts JSON, YAML, Plain Text, HTML, and React/JSX code into Token-Oriented Notation (TOON) - a format optimized for LLM reasoning.

![TOONIFY](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## 🎯 What is TOON?

**TOON (Token-Oriented Notation)** is a lossy abstraction format that exposes the **intent** of code and data structures in a way that's optimized for Large Language Model reasoning. It reduces token count while preserving semantic meaning.

### Key Principles

- **Uppercase keywords** for semantic clarity
- **One semantic unit per line** for easy parsing
- **Flattened hierarchy** with indentation
- **Intent-focused** rather than syntax-focused

## 🚀 Features

- ✅ **Auto-detect input format** (JSON, YAML, Text, HTML, React/JSX)
- ✅ **Side-by-side editors** with Monaco Editor
- ✅ **Real-time conversion** with performance optimization
- ✅ **Token count analysis** showing estimated savings
- ✅ **Copy to clipboard** functionality
- ✅ **Beautiful dark/light themes** with smooth transitions
- ✅ **100% frontend** - no backend, no API calls
- ✅ **Fast performance** with useMemo optimization

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd toonify

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Tech Stack

- **Next.js 15** - App Router
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editing
- **Babel Parser** - AST parsing for React/JSX
- **YAML** - YAML parsing

## 📖 TOON Examples

### JSON → TOON

**Input:**
```json
{
  "order": {
    "id": 1,
    "status": "paid"
  }
}
```

**Output:**
```
ORDER OBJECT
  ID 1
  STATUS paid
```

### HTML → TOON

**Input:**
```html
<div class="card">
  <button onClick="submit()">OK</button>
</div>
```

**Output:**
```
ELEMENT DIV
  CLASS card
  ELEMENT BUTTON
    TEXT OK
    EVENT onClick submit()
```

### React → TOON

**Input:**
```jsx
function Login({ user }) {
  return <button onClick={login}>Login {user.name}</button>
}
```

**Output:**
```
COMPONENT Login
  PROP user
  RENDER BUTTON
    TEXT Login
    DYNAMIC user.name
    EVENT onClick login
```

## 🎯 Use Cases

1. **LLM Prompt Optimization** - Reduce token usage in AI prompts
2. **Code Summarization** - Extract semantic meaning for AI analysis
3. **Intent Extraction** - Focus on what code does, not how
4. **Semantic Search** - Index code by intent rather than syntax

## ⚙️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and themes
├── components/
│   ├── Header.tsx          # App header with theme toggle
│   ├── EditorPanel.tsx     # Monaco editor wrapper
│   ├── FormatSelector.tsx  # Format selection UI
│   └── StatsPanel.tsx      # Token statistics display
├── lib/
│   └── converters/
│       ├── base.ts         # Base converter class
│       ├── json.ts         # JSON converter
│       ├── yaml.ts         # YAML converter
│       ├── text.ts         # Plain text converter
│       ├── html.ts         # HTML converter
│       ├── react.ts        # React/JSX converter
│       └── index.ts        # Converter orchestrator
└── types/
    └── index.ts            # TypeScript definitions
```

## 🎨 Themes

TOONIFY features beautiful, carefully crafted color schemes:

### Dark Theme
- Deep purple/indigo background (#0a0a1a)
- Cyan accent (#00d4ff)
- Purple secondary (#7c3aed)

### Light Theme
- Soft lavender background (#faf8ff)
- Vibrant purple accent (#7c3aed)
- Cyan tertiary (#00d4ff)

## 🔧 Converter Details

### JSON Converter
- Recursive object traversal
- Handles arrays, objects, primitives
- Preserves hierarchy with indentation

### YAML Converter
- Parses YAML to JSON
- Delegates to JSON converter
- Handles YAML-specific syntax

### Text Converter
- Extracts semantic structure
- Identifies headings, lists, key-value pairs
- Fallback format for unrecognized input

### HTML Converter
- Parses DOM structure
- Extracts elements, attributes, events
- Handles nested elements

### React Converter
- Uses Babel AST parsing
- Extracts components, props, JSX
- Handles function and arrow components
- Identifies event handlers and dynamic content

## ⚠️ Limitations

1. **Lossy Conversion** - TOON is not reversible; it's an abstraction
2. **No Execution** - TOON represents intent, not executable code
3. **Approximation** - Token counts are estimates (1 token ≈ 4 chars)
4. **Complex Logic** - Deep nesting may lose some context
5. **Comments** - Code comments are not preserved

## 🤝 Best Practices

1. Use TOON for **intent extraction**, not code execution
2. Ideal for **LLM prompts** where token count matters
3. Great for **code summarization** and documentation
4. Perfect for **semantic analysis** of code structure
5. Not a replacement for actual JSON/YAML/code

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Built with Next.js and React
- Monaco Editor for code editing
- Babel for AST parsing
- Tailwind CSS for styling

---

**Note:** TOONIFY is a frontend-only tool. All processing happens in your browser. No data is sent to any server.
