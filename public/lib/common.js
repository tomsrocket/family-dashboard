
function initButtons(fn_back, fn_next, fn_center=null, btn_back=null, btn_next=null, btn_center=null) {

  if (btn_back) {
    btn_back.addEventListener('click', () => fn_back());
  }
  if (btn_next) {
    btn_next.addEventListener('click', () => fn_next());
  }
  if (btn_center) {
    btn_center.addEventListener('click', () => fn_center());
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') fn_back();
    if (e.key === '2') fn_next();
    if (e.key === '3' && fn_center) fn_center();
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
          } else if (b === 2 && fn_center) { // Joystick Button #3
            fn_center();
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
