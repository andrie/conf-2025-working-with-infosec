// stop the animation if the loop attribute is set to false
function stopAnimation(event) {
  // pause the previous slide if it contains an animation
  if (event && event.previousSlide) {
    const prevPlayer = event.previousSlide.querySelector('motion-canvas-player');
    if (prevPlayer && prevPlayer.player && prevPlayer.player.playerState?.current?.paused === false) {
      prevPlayer.player.togglePlayback();
    }
  }

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
}

// Initialize all players to be paused except current slide
function initializePlayers() {
  const allPlayers = document.querySelectorAll('motion-canvas-player');
  let currentSlidePlayer = null;

  // Only get current slide player if Reveal is ready
  if (window.Reveal && Reveal.isReady()) {
    currentSlidePlayer = Reveal.getCurrentSlide()?.querySelector('motion-canvas-player');
  }

  allPlayers.forEach((player) => {
    // Skip the current slide's player if we can identify it
    if (currentSlidePlayer && player === currentSlidePlayer) {
      return;
    }

    // If Reveal isn't ready, pause all players (safer default)
    // If player is already loaded, pause it
    if (player.player) {
      const isPaused = player.player.playerState?.current?.paused;
      if (!isPaused) {
        player.player.togglePlayback(); // Pause
      }
    }
  });
}

// Check every 100ms if Reveal is defined
document.addEventListener("DOMContentLoaded", function() {
  const checkReveal = setInterval(function() {
    if (window.Reveal && Reveal.isReady()) {
      // If Reveal is defined, set up the event listener and clear the interval
      // console.log("Reveal is ready")

      // Initialize players, preserving current slide's state
      initializePlayers();

      // Start animation on current slide
      const currentPlayer = Reveal.getCurrentSlide().querySelector('motion-canvas-player');
      if (currentPlayer) {
        // Set auto attribute and start the current slide player
        currentPlayer.setAttribute('auto', 'true');

        // Wait for player object to be ready, then start it
        const waitForPlayer = setInterval(() => {
          if (currentPlayer.player) {
            clearInterval(waitForPlayer);
            if (currentPlayer.player.playerState?.current?.paused !== false) {
              currentPlayer.player.togglePlayback();
            }
          }
        }, 50);

        // Safety timeout
        setTimeout(() => {
          clearInterval(waitForPlayer);
        }, 5000);
      }

      Reveal.on('slidechanged', stopAnimation);
      clearInterval(checkReveal);
    }
  }, 50);
});
