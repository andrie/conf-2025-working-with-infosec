### Motion Canvas Documentation - Version 3.17.2

#### Core APIs and Components

##### Scene Creation
```typescript
import {makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene logic here
});
```

##### Node Types
- **Rect**: Rectangles with fills, strokes, rounded corners
- **Circle**: Circles and ellipses
- **Txt**: Text with fonts, sizes, colors, alignment
- **Img**: Images and sprites
- **Line**: Lines and paths
- **Layout**: Container for flexbox-style layouts
- **Node**: Base class for all visual elements

##### Animation Methods
- `yield*` - Execute animations sequentially
- `tween(duration, callback)` - Create smooth transitions
- `waitFor(seconds)` - Add timing delays
- `all(...animations)` - Run animations in parallel
- `chain(...animations)` - Run animations sequentially

##### Signal System
- Reactive values that automatically update dependents
- `createSignal(initialValue)` - Create reactive state
- `node.position()` - Get current value
- `node.position(newValue)` - Set new value
- `node.position.to(target, duration)` - Animate to target

##### Layout System
- Flexbox-style positioning
- `justifyContent`, `alignItems`, `direction`, `gap`
- `size`, `margin`, `padding`
- Relative positioning with `position.x()`, `position.y()`

#### Common Patterns

##### Basic Animation Setup
```typescript
const rect = createRef<Rect>();

view.add(
  <Rect
    ref={rect}
    width={100}
    height={100}
    fill="#ff0000"
    position={[0, 0]}
  />
);

yield* rect().scale(2, 1);
```

##### Sequential Animations
```typescript
yield* rect().position.x(200, 1);
yield* rect().rotation(90, 0.5);
yield* rect().opacity(0, 1);
```

##### Parallel Animations
```typescript
yield* all(
  rect().position.x(200, 1),
  rect().rotation(90, 1),
  rect().scale(1.5, 1)
);
```

##### Text Animations
```typescript
const text = createRef<Txt>();

view.add(
  <Txt
    ref={text}
    fontSize={48}
    fontFamily="Arial"
    fill="#ffffff"
    text="Hello World"
  />
);

yield* text().text("Animated Text", 1);
```

#### Project Structure
- `/animations/src/` - Motion Canvas source files
- `/animations/src/scenes/` - Individual scene files
- `/animations/src/project.ts` - Project configuration
- `/animations/vite.config.ts` - Build configuration

#### Build Commands
- `npm run serve` - Start development server with live preview
- `npm run build` - Build/export animations to video
- `make serve` - Alternative via Makefile
- `make anim` - Build animations via Makefile

#### InfoSec Animation Context
This project creates animations for a security presentation. Consider:
- Security-themed colors (red, orange, green for alerts/status)
- Network diagrams and data flow visualizations
- Code snippets and terminal outputs
- Timeline animations for attack scenarios
- Interactive elements showing security concepts

#### Type Definitions
The project has full TypeScript support with rich type definitions available in:
- `node_modules/@motion-canvas/core/` - Core animation types and interfaces
- `node_modules/@motion-canvas/2d/` - 2D rendering components and nodes
- `node_modules/@motion-canvas/ui/` - UI components for the editor

These type definitions contain comprehensive API documentation accessible through IDE IntelliSense, including:
- Method signatures and parameters
- Property types and valid values
- JSDoc comments with usage examples
- Interface definitions for all Motion Canvas objects

#### Cardinal Points and Edge Positioning

Motion Canvas provides powerful edge positioning for connecting elements:

**Edge Position Properties (available on Layout components):**
```typescript
// Edge positions
readonly top: SimpleVector2Signal<this>;
readonly bottom: SimpleVector2Signal<this>;
readonly left: SimpleVector2Signal<this>;
readonly right: SimpleVector2Signal<this>;

// Corner positions
readonly topLeft: SimpleVector2Signal<this>;
readonly topRight: SimpleVector2Signal<this>;
readonly bottomLeft: SimpleVector2Signal<this>;
readonly bottomRight: SimpleVector2Signal<this>;
```

**Connecting Lines Using Cardinal Points:**
```typescript
// Connect from right edge of element1 to left edge of element2
<Line
  points={[
    () => element1().right(),  // Right edge of first element
    () => element2().left()    // Left edge of second element
  ]}
  stroke="#447099"
  lineWidth={4.5}
  startArrow
  endArrow
/>
```

**Alternative using cardinalPoint() method:**
```typescript
import { Direction } from '@motion-canvas/core';

<Line
  points={[
    () => element1().cardinalPoint(Direction.Right),
    () => element2().cardinalPoint(Direction.Left)
  ]}
/>
```

**Available Direction/Origin enums:**
- `Direction.Top`, `Direction.Bottom`, `Direction.Left`, `Direction.Right`
- `Origin.Middle`, `Origin.TopLeft`, `Origin.TopRight`, etc.

#### Color and Transparency
- Use `"rgba(0,0,0,0)"` for transparent fills (not `"transparent"`)
- Motion Canvas doesn't support CSS-style `"transparent"` keyword

#### Database and 3D Shape Visualization

**3D Database Cylinder:**
To create a professional database symbol using wireframe style:
```typescript
{/* Top ellipse (full) */}
<Circle
  ref={dbTopEllipse}
  width={90}
  height={20}
  fill="rgba(0,0,0,0)"
  stroke={Posit.blue}
  lineWidth={4.5}
  position={[450, 120]}
/>

{/* Bottom ellipse (partial - only front arc visible) */}
<Circle
  ref={dbBottomEllipse}
  width={90}
  height={20}
  fill="rgba(0,0,0,0)"
  stroke={Posit.blue}
  lineWidth={4.5}
  position={[450, 180]}
  startAngle={0}
  endAngle={180}
/>

{/* Vertical lines connecting the ellipses */}
<Line
  points={[[405, 120], [405, 180]]}
  stroke={Posit.blue}
  lineWidth={4.5}
/>
<Line
  points={[[495, 120], [495, 180]]}
  stroke={Posit.blue}
  lineWidth={4.5}
/>
```

**Key Techniques:**
- Use `Circle` with different `width` and `height` to create ellipses
- Full ellipse for top face (visible from above)
- Partial ellipse for bottom face using `startAngle={0}` and `endAngle={180}`
- Vertical `Line` elements for cylinder sides
- Transparent fills with visible strokes for wireframe effect

#### Code Component and Syntax Highlighting

Motion Canvas provides a dedicated `Code` component for displaying code with syntax highlighting:

**Basic Usage:**
```typescript
import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

<Code
  code={`const hello = "world";`}
  fontSize={24}
  fontFamily="'JetBrains Mono', monospace"
/>
```

**With Custom Highlighter:**
```typescript
<Code
  highlighter={new LezerHighlighter(parser)}
  code={codeString}
  fontSize={24}
  position={[0, 0]}
  width={800}
/>
```

**Highlighter Configuration:**
- **LezerHighlighter**: Uses Lezer parsers for syntax highlighting
- **Official parsers**: `@lezer/javascript`, `@lezer/python`, `@lezer/rust`, etc.
- **Community parsers**: `lezer-r` for R language support
- **Default highlighter**: Can be set globally with `Code.defaultHighlighter`

**Language-specific Setup:**
```typescript
// JavaScript/TypeScript with dialects
import {parser as jsParser} from '@lezer/javascript';
Code.defaultHighlighter = new LezerHighlighter(
  jsParser.configure({
    dialect: 'jsx ts' // Enable JSX and TypeScript
  })
);

// R language syntax highlighting
import {parser as rParser} from 'lezer-r';
<Code
  highlighter={new LezerHighlighter(rParser)}
  code={rCode}
/>
```

**Custom Themes:**
```typescript
import {HighlightStyle} from '@codemirror/language';
import {tags} from '@lezer/highlight';

const customStyle = HighlightStyle.define([
  {tag: tags.keyword, color: '#ff6470'},
  {tag: tags.string, color: '#99C47A'},
  {tag: tags.comment, color: '#808586'}
]);

const highlighter = new LezerHighlighter(parser, customStyle);
```

**Creating Brand-Consistent Themes:**
```typescript
// Using Posit brand colors for syntax highlighting
import {Posit, Colors} from '../styles';

const positStyle = HighlightStyle.define([
  { tag: tags.keyword, color: Colors.KEYWORD },        // Pink/red (#ff6470)
  { tag: tags.string, color: Colors.STRING },          // Green (#99C47A)
  { tag: tags.comment, color: Colors.COMMENT },        // Gray (#808586)
  { tag: tags.function(tags.variableName), color: Colors.FUNCTION }, // Yellow (#ffc66d)
  { tag: tags.variableName, color: Posit.orange },     // Orange (#EE6331)
  { tag: tags.literal, color: Colors.NUMBER },         // Blue (#68ABDF)
  { tag: tags.operator, color: Posit.teal },           // Teal (#419599)
  { tag: tags.punctuation, color: Colors.TEXT },       // Light gray (#ACB3BF)
]);
```

**GitHub-Style Dark Theme:**
```typescript
const githubDarkStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#ff7b72' },        // Light red
  { tag: tags.string, color: '#a5d6ff' },         // Light blue
  { tag: tags.comment, color: '#8b949e' },        // Medium gray
  { tag: tags.function(tags.variableName), color: '#d2a8ff' }, // Light purple
  { tag: tags.variableName, color: '#ffa657' },   // Light orange
  { tag: tags.literal, color: '#79c0ff' },        // Light cyan
  { tag: tags.operator, color: '#ff7b72' },       // Light red
  { tag: tags.punctuation, color: '#e6edf3' },    // Light white
]);
```

**Code Component Properties:**
- `code`: The code string to display
- `highlighter`: Syntax highlighter instance
- `fontSize`: Text size
- `fontFamily`: Font (JetBrains Mono recommended)
- `width`: Container width for wrapping
- `offsetX/offsetY`: Text alignment adjustments

**Animation Capabilities:**
```typescript
// Animate code changes
yield* codeRef().code(`new code content`, duration);

// Line-by-line reveals using selection
yield* codeRef().selection(lines(0, 5), duration);
```

#### Common Issues
- Ensure proper TypeScript setup in `tsconfig.json`
- Use `createRef()` for accessing node properties after creation
- Remember `yield*` for sequential animations
- Motion Canvas uses its own coordinate system (center origin)
- Use cardinal points for dynamic element connections
- Transparent fills must use RGBA format, not CSS keywords
- Install appropriate Lezer parser packages for syntax highlighting (`npm i @lezer/javascript`)
- For R language support, install the community parser: `npm i lezer-r`
- TypeScript may show implicit 'any' warnings for community parsers like `lezer-r` - this is expected behavior