
import { GripVertical } from '../../components/Icons';

export default function DragTutorial() {
    return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border-2 border-blue-500/20 flex items-center justify-center animate-fadeOut opacity-0" style={{ animation: 'fadeInOut 5s forwards' }}>
            <div className="relative w-32 h-20 flex flex-col justify-center select-none">
                {/* Animated Item */}
                <div className="relative h-8 w-full bg-white rounded-lg border-2 border-cyan-500 shadow-md flex items-center px-2 z-10 animate-tutorial-drag-item">
                    <GripVertical className="w-4 h-4 text-cyan-600 mr-2" />
                    <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                </div>

                {/* Finger/Hand Animation */}
                <div className="absolute top-1/2 left-8 w-8 h-8 z-20 pointer-events-none animate-tutorial-finger">
                    {/* Touch Ring (Hold indicator) */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 animate-tutorial-ring"></div>
                    {/* Finger */}
                    <div className="w-full h-full bg-gray-900/90 rounded-full backdrop-blur-sm border-2 border-white shadow-xl flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.9); }
          10% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); pointer-events: none; }
        }

        @keyframes tutorial-finger {
          0%, 15% { transform: translate(10px, 10px) scale(1.1); opacity: 0; }
          20% { transform: translate(0, 0) scale(1); opacity: 1; }
          40% { transform: translate(0, 0) scale(0.9); } /* Press & Hold */
          70% { transform: translate(0, 30px) scale(0.9); } /* Drag */
          90% { transform: translate(0, 30px) scale(1); opacity: 1; }
          100% { transform: translate(0, 30px) scale(1.1); opacity: 0; }
        }
        @keyframes tutorial-ring {
           0%, 20% { transform: scale(1); opacity: 0; }
           25% { transform: scale(1); opacity: 1; }
           40% { transform: scale(1.8); opacity: 0; border-width: 0px; } 
           100% { opacity: 0; }
        }
        @keyframes tutorial-drag-item {
           0%, 40% { transform: translateY(0); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
           45% { transform: translateY(0) scale(1.02); z-index: 20; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-color: #06b6d4; }
           70% { transform: translateY(30px) scale(1.02); }
           90%, 100% { transform: translateY(30px) scale(1); opacity: 0.5; }
        }
        
        .animate-tutorial-finger { animation: tutorial-finger 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-tutorial-ring { animation: tutorial-ring 2.5s infinite ease-out; }
        .animate-tutorial-drag-item { animation: tutorial-drag-item 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
        </div>
    );
}
