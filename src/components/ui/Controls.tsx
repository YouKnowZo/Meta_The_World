import { useEffect, useState } from 'react';
import { useGameStore } from '../../store';
import { Navigation, Zap } from 'lucide-react';

export function Controls() {
  const user = useGameStore((state) => state.user);
  const updateUser = useGameStore((state) => state.updateUser);
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key) || e.key === 'Shift') {
        setKeys((prev) => ({ ...prev, [key === 'shift' ? 'shift' : key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key) || e.key === 'Shift') {
        setKeys((prev) => ({ ...prev, [key === 'shift' ? 'shift' : key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const speed = keys.shift ? 2 : 1;
    const moveSpeed = 0.5 * speed;
    
    const interval = setInterval(() => {
      const newPosition = { ...user.avatar.position };
      
      if (keys.w) newPosition.z -= moveSpeed;
      if (keys.s) newPosition.z += moveSpeed;
      if (keys.a) newPosition.x -= moveSpeed;
      if (keys.d) newPosition.x += moveSpeed;
      
      if (keys.w || keys.s || keys.a || keys.d) {
        updateUser({
          avatar: {
            ...user.avatar,
            position: newPosition
          }
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [keys, user.avatar, updateUser]);

  return (
    <div className="fixed bottom-24 left-4 z-40 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 pointer-events-auto">
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold text-sm">Movement Controls</span>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className={`px-2 py-1 rounded ${keys.w ? 'bg-blue-500' : 'bg-gray-700'} text-white font-mono`}>
                W
              </kbd>
              <kbd className={`px-2 py-1 rounded ${keys.a ? 'bg-blue-500' : 'bg-gray-700'} text-white font-mono`}>
                A
              </kbd>
              <kbd className={`px-2 py-1 rounded ${keys.s ? 'bg-blue-500' : 'bg-gray-700'} text-white font-mono`}>
                S
              </kbd>
              <kbd className={`px-2 py-1 rounded ${keys.d ? 'bg-blue-500' : 'bg-gray-700'} text-white font-mono`}>
                D
              </kbd>
            </div>
            <span className="text-gray-400">Move</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className={`px-2 py-1 rounded ${keys.shift ? 'bg-blue-500' : 'bg-gray-700'} text-white font-mono`}>
                Shift
              </kbd>
            </div>
            <span className="text-gray-400">Sprint</span>
            {keys.shift && <Zap className="w-3 h-3 text-yellow-400" />}
          </div>

          <div className="pt-2 border-t border-white/10">
            <div className="text-gray-400">
              Position: ({user.avatar.position.x.toFixed(0)}, {user.avatar.position.z.toFixed(0)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
