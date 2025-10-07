import {makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Rect, Txt, Line, Circle, Code} from '@motion-canvas/2d/lib/components';
import {Posit, Colors} from '../styles';
import {parser} from 'lezer-r';
import {Database} from '../components/Database';
import {RHighlighter} from '../components/RHighlighter';


export default makeScene2D(function* (view) {
  // Create custom R highlighter with direct node type mapping
  const rHighlighter = new RHighlighter(parser, {
    default: Colors.TEXT,           // Base text color (Posit blue)
    identifier: Posit.orange,       // Variable names
    function: Colors.FUNCTION,      // Function names (yellow)
    keyword: Colors.KEYWORD,        // Keywords like 'function' (pink)
    string: Colors.STRING,          // Strings (green)
    comment: Colors.COMMENT,        // Comments (gray)
    operator: Posit.teal,          // Operators like <-, $ (teal)
    number: Colors.NUMBER,          // Numbers (blue)
  });

  // Create references for our elements
  const codeComponent = createRef<Code>();

  // Diagram elements
  const appBox = createRef<Rect>();
  const userText = createRef<Txt>();
  const appText = createRef<Txt>();
  const llmText = createRef<Txt>();

  // Database component
  const database = createRef<Database>();

  // Connection lines
  const userToApp = createRef<Line>();
  const appToData = createRef<Line>();
  const appToLlm = createRef<Line>();

  const rCode = `
library(shiny)
library(ellmer)

# Define UI
ui <- fluidPage(
  textInput("user_input", "Enter your question:"),
  actionButton("submit", "Submit"),
  textOutput("llm_response")
)

# Define server logic
server <- function(input, output) {
  observeEvent(input$submit, {
    # Connect to data source
    data <- read_data()

    # Use ellmer to query LLM
    response <- ellmer_query(
      prompt = input$user_input,
      context = data
    )
    
    # Display response
    output$llm_response <- renderText(response)
    
  })
}

# Run the application
shinyApp(ui = ui, server = server)
`;

  // Add elements to view
  view.add(
    <>

      {/* Code component with custom R syntax highlighting */}
      <Code
        ref={codeComponent}
        highlighter={rHighlighter}
        code={rCode}
        fontSize={24}
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fill={Colors.TEXT}
        position={[-450, 50]}
        width={850}
      />

      {/* User - no box, just text */}
      <Txt
        ref={userText}
        fontSize={63}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="User"
        position={[100, -100]}
      />

      {/* App box - with stroke like SVG */}
      <Rect
        ref={appBox}
        width={270}
        height={135}
        fill="rgba(0,0,0,0)"
        stroke={Posit.blue}
        lineWidth={6.75}
        position={[450, -100]}
      />
      <Txt
        ref={appText}
        fontSize={63}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="App"
        position={[450, -100]}
      />

      {/* LLM - no box, just text */}
      <Txt
        ref={llmText}
        fontSize={63}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="LLM"
        position={[800, -100]}
      />

      {/* Database component - 3D database cylinder */}
      <Database
        ref={database}
        size={[150, 150]}
        stroke={Posit.blue}
        lineWidth={6.75}
        position={[450, 150]}
      />

      {/* Connection lines - bidirectional like SVG */}
      <Line
        ref={userToApp}
        points={[
          () => userText().right(),
          () => appBox().left()
        ]}
        stroke={Posit.blue}
        lineWidth={4.5}
        startArrow
        endArrow
        arrowSize={18}
      />

      <Line
        ref={appToLlm}
        // points={[[585, -100], [650, -100]]}
        points={[
          () => appBox().right(),
          () => llmText().left()
        ]}
        stroke={Posit.blue}
        lineWidth={4.5}
        startArrow
        endArrow
        arrowSize={18}
      />

      <Line
        ref={appToData}
        points={[
          () => appBox().bottom(),
          () => database().top()
        ]}
        stroke={Posit.blue}
        lineWidth={4.5}
        startArrow
        endArrow
        arrowSize={18}
      />
    </>
  );

  // No animation for now
});