// A few dozen silver points that twinkle behind the page wherever the form
// does not run: phones, tablets, struggling desktops and the list view. The
// positions come from a fixed seed, so the server and browser draw the same sky.

const COUNT = 40;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const random = seeded(20201);
const stars = Array.from({ length: COUNT }, () => ({
  left: `${(random() * 100).toFixed(2)}%`,
  top: `${(random() * 100).toFixed(2)}%`,
  size: `${(1 + random() * 1.2).toFixed(2)}px`,
  duration: `${(2 + random() * 3).toFixed(2)}s`,
  delay: `${(-random() * 5).toFixed(2)}s`,
}));

export function Starfield() {
  return (
    <div aria-hidden="true" className="starfield">
      {stars.map((star, index) => (
        <span
          key={index}
          style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDuration: star.duration, animationDelay: star.delay }}
        />
      ))}
    </div>
  );
}
