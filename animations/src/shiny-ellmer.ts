import {makeProject} from '@motion-canvas/core';

import shiny_ellmer from './scenes/shiny-ellmer?scene';

// import global styles
import '../global.css';

export default makeProject({
  scenes: [shiny_ellmer],
});