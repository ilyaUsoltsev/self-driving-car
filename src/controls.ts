class Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;

  constructor(private type: 'KEYS' | 'DUMMY') {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    if (this.type === 'KEYS') {
      this.addKeyboardListeners();
    } else if (this.type === 'DUMMY') {
      this.forward = true;
    }
  }

  private addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
      }
    };
  }
}

export default Controls;
