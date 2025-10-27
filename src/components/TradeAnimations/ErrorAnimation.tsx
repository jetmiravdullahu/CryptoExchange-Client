export default function ErrorAnimation() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative">
        {/* Error particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-destructive rounded-full animate-error-particle"
            style={
              {
                left: "50%",
                top: "50%",
                animationDelay: `${Math.random() * 0.3}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`,
                "--tx": `${(Math.random() - 0.5) * 200}px`,
                "--ty": `${(Math.random() - 0.5) * 200}px`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Error icon */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative animate-shake">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />

            {/* Error X circle */}
            <div className="relative w-32 h-32 rounded-full bg-destructive flex items-center justify-center animate-scale-in">
              <svg
                className="w-16 h-16 text-destructive-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                  className="animate-draw-x"
                />
              </svg>
            </div>
          </div>

          <div className="text-center space-y-2 animate-slide-up">
            <h2 className="text-3xl font-bold text-destructive">Trade Failed</h2>
            <p className="text-muted-foreground">Something went wrong with your transaction</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes error-particle {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes draw-x {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-error-particle {
          animation: error-particle forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-draw-x {
          stroke-dasharray: 100;
          animation: draw-x 0.4s ease-out 0.3s forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.5s both;
        }
      `}</style>
    </div>
  )
}
