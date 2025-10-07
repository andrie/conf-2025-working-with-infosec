import {makeScene2D, LezerHighlighter} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Rect, Txt, Line, Circle, Code} from '@motion-canvas/2d/lib/components';
import {Posit, Colors} from '../styles';
import {parser} from 'lezer-r';
import {HighlightStyle} from '@codemirror/language';
import {tags} from '@lezer/highlight';

export default makeScene2D(function* (view) {
  // Create Posit-inspired HighlightStyle
  const positStyle = HighlightStyle.define([
    { tag: tags.keyword, color: Colors.KEYWORD },        // Posit red/pink for keywords
    { tag: tags.string, color: Colors.STRING },          // Posit green for strings
    { tag: tags.comment, color: Colors.COMMENT },        // Posit gray for comments
    { tag: tags.function(tags.variableName), color: Colors.FUNCTION }, // Posit yellow for functions
    { tag: tags.variableName, color: Posit.orange },     // Posit orange for variables
    { tag: tags.literal, color: Colors.NUMBER },         // Posit blue for literals/numbers
    { tag: tags.operator, color: Posit.teal },           // Posit teal for operators
    { tag: tags.punctuation, color: Colors.TEXT },       // Posit text color for punctuation
  ]);

  // Create Posit-style LezerHighlighter
  const positHighlighter = new LezerHighlighter(parser, positStyle);

  // Create references for our elements
  const codeComponent = createRef<Code>();

  // Diagram elements
  const appBox = createRef<Rect>();
  const userText = createRef<Txt>();
  const appText = createRef<Txt>();
  const llmText = createRef<Txt>();

  // Database cylinder elements
  const dbTopEllipse = createRef<Circle>();
  const dbBottomEllipse = createRef<Circle>();

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

      {/* Code component with Posit-style syntax highlighting */}
      <Code
        ref={codeComponent}
        highlighter={positHighlighter}
        code={rCode}
        fontSize={24}
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
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

      {/* Database cylinder - proper 3D database shape */}
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

      {/* Left vertical line */}
      <Line
        points={[
          [405, 120],
          [405, 180]
        ]}
        stroke={Posit.blue}
        lineWidth={4.5}
      />

      {/* Right vertical line */}
      <Line
        points={[
          [495, 120],
          [495, 180]
        ]}
        stroke={Posit.blue}
        lineWidth={4.5}
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
          () => dbTopEllipse().top()
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