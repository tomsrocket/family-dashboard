
function initButtons(fn_back, fn_next, btn_back=null, btn_next=null) {

  if (btn_back) {
    btn_back.addEventListener('click', () => fn_back());
  }
  if (btn_next) {
    btn_next.addEventListener('click', () => fn_next());
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') fn_back();
    if (e.key === '2') fn_next();
  });

  // Joystick/Gamepad support
  let gamepadStates = {};

  function checkGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) continue;
      const prevState = gamepadStates[i] || {};
      gamepadStates[i] = {};
      for (let b = 0; b < gamepad.buttons.length; b++) {
        const button = gamepad.buttons[b];
        const pressed = button.pressed;
        const wasPressed = prevState[b] || false;
        gamepadStates[i][b] = pressed;
        if (pressed && !wasPressed) {
          console.log('Gamepad button pressed:', b);
          // Button pressed
          if (b === 0) { // Joystick Button #1
            fn_back();
          } else if (b === 1) { // Joystick Button #2
            fn_next();
          }
        }
      }
    }
  }

  // Check for gamepad input every 100ms
  if ('getGamepads' in navigator) {
    console.log('Gamepad API supported');
    setInterval(checkGamepad, 100);
  }
}
