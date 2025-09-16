// Define the prependBase function
function stopAnimation() {
  const currentSlide = document.querySelector('.reveal .slides > section.present');

  // Select all 'motion-canvas-player' elements in the current slide
  if (currentSlide) {

    // this code assumes one animation per slide
    // TODO: make it work with multiple animations per slide
    
    const player = currentSlide.querySelector('motion-canvas-player')

    // console.log(player.getAttribute('loop'))

    if (player.getAttribute('loop') === 'false'  ) {
      setTimeout(() => {
        pname = player.player.project.name
        console.log("<motio-canvas-player> Waiting for animation '" + pname + "' to end...")
        const frameCheckInterval = setInterval(() => {
          f = player.player.frame.value;
          nf = player.player.endFrame;
          if (f === nf) {
            console.log("<motio-canvas-player> End of animation '" + pname + "' reached.");
            player.player.togglePlayback();
            player.player.requestSeek(nf);
            player.player.deactivate();
            clearInterval(frameCheckInterval);
          }
        }, 1000 / 60); // Check every frame (assuming 60 FPS)
        
        // Clear the interval when the slide changes
        Reveal.addEventListener('slidechanged', () => {
          clearInterval(frameCheckInterval);
        });

      }, 1000); // Adjust the delay as needed
    }
  }
}


// Check every 100ms if Reveal is defined
var checkReveal = setInterval(function() {
  if (window.Reveal) {
    // If Reveal is defined, set up the event listener and clear the interval
    Reveal.addEventListener('ready', stopAnimation);
    Reveal.addEventListener('slidechanged', stopAnimation);
    clearInterval(checkReveal);
  }
}, 1000);

// Notes
// players[0].player.playback.duration  // duration (frames) of the animation
// players[0].player.endFrame          // last frame of the animation
// players[0].player.requestSeek(861)   // seek to a specific frame


// Define the watchEndFrame function

// Add the event listener for the 'slidechanged' event
// Reveal.addEventListener('slidechanged', watchEndFrame);