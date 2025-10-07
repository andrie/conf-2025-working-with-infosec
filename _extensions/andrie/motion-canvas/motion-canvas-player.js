// stop the animation if the loop attribute is set to false
function stopAnimation(event) {
  // if (event) console.log("event found"); else console.log("no event");
  // if (ct) console.log("ct player found");
  // console.log(ct)
  // const player = document.querySelector('section.present.slide.present motion-canvas-player')
  const player = Reveal.getCurrentSlide().querySelector('motion-canvas-player');
  if (player) {
    // this code assumes one animation per slide
    // TODO: make it work with multiple animations per slide
    
    // start the animation
    console.log('motion-canvas.lua: setting auto to true')
    // console.log('motion-canvas.lua: loop = ', player.player.playerState("loop"))
    player.setAttribute('auto', 'true');


    const startCheckInterval = setInterval(() => {
      // wait for player to start
      console.log('motion-canvas.lua: checking player...')
      if (player.player) {
        clearInterval(startCheckInterval);
        const fps = 60; // frames per second
        maxf = 0;
        if (player.getAttribute('loop') === 'false'  ) {
          console.log('motion-canvas.lua: loop is false')
          const frameCheckInterval = setInterval(() => {
            if (player.player && !player.player.active) {
              player.player.activate()
            }
            if (player.player && player.player.frame) {
              const f = player.player.frame.value;
              const nf = player.player.endFrame;
              if (f === nf || f < maxf) {
                clearInterval(frameCheckInterval);
                player.player.requestSeek(nf);
                player.player.deactivate();
              }
              maxf = f;
            }
          }, 1000 / fps); // Check every frame
          
          // Clear the interval when the slide changes
          Reveal.addEventListener('slidechanged', () => {
            clearInterval(frameCheckInterval);
          });
        }
      }
    }, 50)  // wait for player to start

  }

  // pause the previous slide if it contains an animation
  // console.log(event.previousSlide);
  if (event && event.previousSlide) {
    const prevPlayer = event.previousSlide.querySelector('motion-canvas-player');
    if (prevPlayer) {
      prevPlayer.player.togglePlayback();
    }
  }
}

// Check every 100ms if Reveal is defined
document.addEventListener("DOMContentLoaded", function() {
  const checkReveal = setInterval(function() {
    if (window.Reveal && Reveal.isReady()) {
      // If Reveal is defined, set up the event listener and clear the interval
      // console.log("Reveal is ready")
      stopAnimation()
      Reveal.on('slidechanged', stopAnimation);
      clearInterval(checkReveal);
    }
  }, 50);
});
