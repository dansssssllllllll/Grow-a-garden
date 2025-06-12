import { GameEvent } from '@/types/game';

interface EventsDisplayProps {
  activeEvents: GameEvent[];
}

export default function EventsDisplay({ activeEvents }: EventsDisplayProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <h3 className="font-game font-bold text-lg text-forest mb-4">⚡ Active Events</h3>
      
      <div className="space-y-2">
        {activeEvents.length === 0 ? (
          <div className="text-sm text-gray-600 text-center py-4">
            <div className="text-2xl mb-2">😴</div>
            <p>No active events</p>
            <p className="text-xs text-gray-400">Events will start automatically!</p>
          </div>
        ) : (
          activeEvents.map((event) => (
            <div
              key={event.name}
              className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-3 rounded-r-lg animate-pulse"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{event.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-yellow-800">
                    {event.name}
                  </div>
                  <div className="text-xs text-yellow-700">
                    x{event.multiplier} value boost • {event.description}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activeEvents.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700 text-center">
            ✨ Sell your fruits now for maximum profit! ✨
          </p>
        </div>
      )}
    </div>
  );
}
