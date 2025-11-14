import { useEffect, useState } from 'react';

export function useKeyboardControls() {
  const [keys, setKeys] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(k => ({ ...k, moveForward: true }));
          break;
        case 's':
        case 'arrowdown':
          setKeys(k => ({ ...k, moveBackward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys(k => ({ ...k, moveLeft: true }));
          break;
        case 'd':
        case 'arrowright':
          setKeys(k => ({ ...k, moveRight: true }));
          break;
        case ' ':
          e.preventDefault();
          setKeys(k => ({ ...k, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(k => ({ ...k, moveForward: false }));
          break;
        case 's':
        case 'arrowdown':
          setKeys(k => ({ ...k, moveBackward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys(k => ({ ...k, moveLeft: false }));
          break;
        case 'd':
        case 'arrowright':
          setKeys(k => ({ ...k, moveRight: false }));
          break;
        case ' ':
          setKeys(k => ({ ...k, jump: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
