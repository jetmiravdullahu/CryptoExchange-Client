export default function SuccessAnimation() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative">
        {/* Confetti particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={
              {
                left: "50%",
                top: "50%",
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`,
                "--tx": `${(Math.random() - 0.5) * 400}px`,
                "--ty": `${(Math.random() - 0.5) * 400}px`,
                "--r": `${Math.random() * 720}deg`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Success checkmark */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            {/* Expanding rings */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />

            {/* Checkmark circle */}
            <div className="relative w-32 h-32 rounded-full bg-primary flex items-center justify-center animate-scale-in">
              <svg
                className="w-16 h-16 text-primary-foreground animate-draw-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          </div>

          <div className="text-center space-y-2 animate-slide-up">
            <h2 className="text-3xl font-bold text-primary">Trade Successful!</h2>
            <p className="text-muted-foreground">Your transaction has been completed</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) rotate(var(--r));
            opacity: 0;
          }
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
        @keyframes draw-check {
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
        .animate-confetti {
          animation: confetti forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-draw-check {
          stroke-dasharray: 100;
          animation: draw-check 0.6s ease-out 0.3s forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.5s both;
        }
      `}</style>
    </div>
  )
}
