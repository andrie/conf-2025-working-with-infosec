import { makeScene2D, Circle, Rect, Txt, TxtProps, Line, Node } from "@motion-canvas/2d";
import {CodeBlock, lines} from '@motion-canvas/2d/lib/components/CodeBlock';
import { createRef, makeRef, all, loop, linear, experimentalLog, RefsProperty, waitFor, DEFAULT } from "@motion-canvas/core";
import {useLogger} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();
  const quarto = createRef<Rect>();
  const mc = createRef<Rect>();
  const containerLeft = createRef<Rect>();
  const containerRight = createRef<Rect>();

  const tr1 = createRef<Txt>();
  const tr2 = createRef<Txt>();
  const tr3 = createRef<Txt>();
  const tr4 = createRef<Txt>();
  const tr5 = createRef<Txt>();

  const l1 = createRef<Line>();
  const l2 = createRef<Line>();
  const l3 = createRef<Line>();
  const l4 = createRef<Line>();

  const cb = createRef<CodeBlock>();

  const logger = useLogger();
 
  

  const RECT_WIDTH = 400;
  const RECT_HEIGHT = 140;
  const RECT_FILL = "lightgrey";
  const TEXT_COLOR = "blue";

  const WIDTH = 1980;
  const HEIGHT = 1080;

  const yPos = (n:number, t:number) => {
    return HEIGHT/2 * n/(t+1);
  }

  const MyTxt = (props: TxtProps) => (
    <Txt {...props} fontFamily={"Open Sans"} fill={TEXT_COLOR}  >
    </Txt>
    );

  const ConnectingLine = (refs:any) => {
    return (<Line 
      lineWidth={10}
      stroke={"#f00"}
      lineDash={[10, 10]}
      points={[
        refs["rx"].top,
        refs["ry"].bottom,
      ]}
      endArrow
      arrowSize={15}
      endOffset={10}
      startOffset={10}
      start={0}
      lineDashOffset={0}
      {...refs}
    />);
  };

  const code_git = `
  git commit
  git push
  `

  const code_iframe = `
  <iframe src="https://andrie.quarto.pub/goes-paddling" />
  `
        
  view.add(
    <>
      <Node position={[-WIDTH / 4, 0]} >
        {/* left side */}
        <Rect ref={containerLeft} position={[0,0]} opacity={1} 
          stroke="#f00" lineWidth={3} 
          size={[WIDTH * 0.45, HEIGHT * 0.95]} >

          <Rect ref={quarto} x={-70} y={-50} fill={'#000'} 
          size={[600, 400]}
          lineWidth={3} stroke="#f00" >

            <CodeBlock ref={cb} position={[0, -100]}
              language="shell"
              code={code_git} />,
          </Rect>
        </Rect>
      </Node>
      
      <Node position={[WIDTH / 4, 0]} >
        {/* right side */}
        <MyTxt fontFamily={"Open Sans"} fill={TEXT_COLOR} />
        <Rect ref={containerRight} position={[0,0]} opacity={1} 
          size={[WIDTH * 0.45, HEIGHT * 0.95]} lineWidth={3} stroke="#f00" >
        </Rect>
          <MyTxt ref={tr1} y={yPos(-2, 2)} text="HCC site" />
          <MyTxt ref={tr2} y={yPos(-1, 2)} text="QuartoPub" />
          <MyTxt ref={tr3} y={yPos(0, 2)} text="Scheduled Action" />
          <MyTxt ref={tr4} y={yPos(1, 2)} text="Version Control" />
          <MyTxt ref={tr5} y={yPos(2, 2)} text="IDE" />

        <ConnectingLine rx={tr5()} ry={tr4()} ref={l1} />
        <ConnectingLine rx={tr4()} ry={tr3()} ref={l2} />
        <ConnectingLine rx={tr3()} ry={tr2()} ref={l3} />
        <ConnectingLine rx={tr2()} ry={tr1()} ref={l4} />

        <Node position={[-200, 0]} >
          <Circle size={100} stroke={'#00f'} lineWidth={5} >
            <Line stroke={'#00f'} lineWidth={5} points={[
              [0, 0],
              [0, -40],
            ]} />
          </Circle>
        </Node>

      </Node>


    </>


  );

  yield* all(
    // cb().language("html", 1),
    // l1().lineDashOffset(-400, 10, linear),
    // l2().lineDashOffset(-400, 10, linear),
    // l3().lineDashOffset(-400, 10, linear),
    // l4().lineDashOffset(-400, 10, linear),
    )

  const code_r1 = 
  `
  x <- function(z) {
    z + 1
  }`

  yield* cb().selection(lines(1, 2), 1);
  yield* cb().selection(DEFAULT, 0);
  yield* cb().edit(1, false)``;
  yield* cb().edit(1, false)`${code_r1}`;
  yield* cb().selection(lines(2,2), 1);
  yield* waitFor(1);
  // yield* waitFor(2);
  yield* cb().fontSize(0, 2)

  // yield* all(
  //   container().opacity(1, 1)
  // )

  // yield* all(
  //   quarto().position([0, -80], 2),
  //   // mc().x(150, 2),
  //   container().position([0, -50], 2),
  //   mc().top(quarto().bottom().addY(-10), 2),
  //   mc().x(0, 2),
  //   // mc().top(quarto().bottom().addX(300), 2),
  //   // myCircle().fill("#e6a700", 1).back(1),
  // );
  
  // yield* all(
  //   container().lineWidth(10, 2)
  // )

  // yield* all(
  //   container().opacity(0, 1)
  // )

});
