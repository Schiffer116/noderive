export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center animate-fade">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <span className="font-semibold text-2xl animate-fade-delay">Noderive</span>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInOutDelay {
          0%, 100% { opacity: 0; transform: translateY(-10px); }
          25%, 75% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade {
          animation: fadeInOut 2s ease-in-out infinite;
        }

        .animate-fade-delay {
          animation: fadeInOutDelay 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

