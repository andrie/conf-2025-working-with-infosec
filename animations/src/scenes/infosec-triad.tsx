import {makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {Polygon, Txt, Layout, Node} from '@motion-canvas/2d/lib/components';
import {Posit} from '../styles';

export default makeScene2D(function* (view) {
  // Calculate scene dimensions for 70% height
  const sceneHeight = view.height() * 0.7;
  const sceneWidth = view.width() * 0.7;

  // Create references for the container and elements
  const diagramContainer = createRef<Node>();
  const triangleRef = createRef<Polygon>();
  const confidentialityText = createRef<Txt>();
  const integrityText = createRef<Txt>();
  const availabilityText = createRef<Txt>();

  // Triangle dimensions (scaled to fit 70% of scene height)
  const desiredTriangleHeight = sceneHeight * 0.6; // Triangle itself takes 60% of the allocated space
  const desiredTriangleWidth = desiredTriangleHeight * 1.2; // Slightly wider for better proportions

  // Compensate for Motion Canvas Polygon inscribed behavior
  // Triangle is inscribed in ellipse, so actual size is smaller than bounding box
  const triangleWidth = desiredTriangleWidth / 0.866; // Compensate for ~√3/2 factor
  const triangleHeight = desiredTriangleHeight / 0.75; // Compensate for height reduction

  // Calculate actual triangle geometry
  // For inscribed triangle: top vertex touches top of bounding box, bottom vertices are at 2/3 down
  const actualTriangleHeight = (3/4) * triangleHeight; // Triangle height is 3/4 of bounding box height
  const actualTriangleBottom = triangleHeight/2 - actualTriangleHeight/3; // Bottom vertices are 1/3 up from bottom

  // Text spacing from triangle edges
  const textSpacing = 100;

  view.add(
    <Node
      ref={diagramContainer}
      position={[0, 100]} // Change this position to move the entire diagram up or down
    >
      {/* Triangle shape using Polygon */}
      <Polygon
        ref={triangleRef}
        sides={3}
        size={[triangleWidth, triangleHeight]}
        stroke={Posit.blue}
        lineWidth={15}
        fill="rgba(0,0,0,0)"
        position={[0, 0]}
        rotation={0}
      />

      {/* Confidentiality text - positioned above the triangle with fixed distance */}
      <Txt
        ref={confidentialityText}
        fontSize={sceneHeight * 0.08}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="Confidentiality"
        position={() => [triangleRef().position.x(), triangleRef().position.y() - triangleHeight/2 - textSpacing]}
        textAlign="center"
        opacity={0}
      />

      {/* Integrity text - positioned below the actual triangle bottom left with fixed distance */}
      <Txt
        ref={integrityText}
        fontSize={sceneHeight * 0.08}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="Integrity"
        position={() => [triangleRef().bottomLeft().x, triangleRef().position.y() + actualTriangleBottom + textSpacing]}
        textAlign="center"
        opacity={0}
      />

      {/* Availability text - positioned below the actual triangle bottom right with fixed distance */}
      <Txt
        ref={availabilityText}
        fontSize={sceneHeight * 0.08}
        fontFamily="Helvetica"
        fill={Posit.blue}
        text="Availability"
        position={() => [triangleRef().bottomRight().x, triangleRef().position.y() + actualTriangleBottom + textSpacing]}
        textAlign="center"
        opacity={0}
      />
    </Node>
  );

  // Triangle appears immediately (it's already visible)
  // Then animate each text label sequentially with 1 second gaps

  // Wait 1 second, then fade in "Confidentiality"
  // yield* waitFor(1);
  yield* confidentialityText().opacity(1, 1);

  // Wait 1 second, then fade in "Integrity"
  yield* waitFor(1);
  yield* integrityText().opacity(1, 1);

  // Wait 1 second, then fade in "Availability"
  yield* waitFor(1);
  yield* availabilityText().opacity(1, 1);
});