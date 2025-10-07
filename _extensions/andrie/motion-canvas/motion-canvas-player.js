// stop the animation if the loop attribute is set to false
function stopAnimation(event) {
  // Pause all animations first to prevent unwanted playback
  const allPlayers = document.querySelectorAll('motion-canvas-player');
  allPlayers.forEach(p => {
    if (p.player && p.player.playerState?.current?.paused === false) {
      p.player.togglePlayback(); // Pause if playing
    }
  });

  // Now handle the current slide's animation
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
        // Use the player's actual fps or default to 30 for lower overhead
        const fps = player.player?.playback?.fps || 30;
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
                // Request seek to end frame
                player.player.requestSeek(nf);

                // Listen for frame change to ensure we're at the end frame before deactivating
                const frameChangeHandler = (frame) => {
                  if (frame >= nf) {
                    player.player.onFrameChanged.unsubscribe(frameChangeHandler);
                    player.player.deactivate();
                  }
                };
                player.player.onFrameChanged.subscribe(frameChangeHandler);

                // Safety timeout in case frame change event doesn't fire
                setTimeout(() => {
                  player.player.onFrameChanged.unsubscribe(frameChangeHandler);
                  player.player.deactivate();
                }, 100);
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

// Initialize all players to be paused
function initializePlayers() {
  const allPlayers = document.querySelectorAll('motion-canvas-player');
  allPlayers.forEach(player => {
    // The Lua extension already sets auto attribute, just ensure players are paused
    // If player is already loaded, pause it
    if (player.player) {
      if (player.player.playerState?.current?.paused === false) {
        player.player.togglePlayback(); // Pause
      }
    }
  });
}

// Check every 100ms if Reveal is defined
document.addEventListener("DOMContentLoaded", function() {
  // Initialize all players to be paused first
  initializePlayers();

  const checkReveal = setInterval(function() {
    if (window.Reveal && Reveal.isReady()) {
      // If Reveal is defined, set up the event listener and clear the interval
      // console.log("Reveal is ready")

      // Re-initialize to ensure all are paused
      initializePlayers();

      // Only start animation on current slide if it should auto-start
      const currentPlayer = Reveal.getCurrentSlide().querySelector('motion-canvas-player');
      if (currentPlayer && currentPlayer.getAttribute('auto') === 'true') {
        stopAnimation(); // This will start the current slide's animation
      }

      Reveal.on('slidechanged', stopAnimation);
      clearInterval(checkReveal);
    }
  }, 50);
});
