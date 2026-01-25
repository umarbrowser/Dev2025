import { formatTime } from "../lib/time"

export default function StatsBar({ rolls, timeSeconds, best }) {
  return (
    <section className="stats" aria-label="Game stats">
      <div className="stat">
        <div className="statLabel">Rolls</div>
        <div className="statValue">{rolls}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Time</div>
        <div className="statValue">{formatTime(timeSeconds)}</div>
      </div>
      <div className="stat">
        <div className="statLabel">Best</div>
        <div className="statValue">
          {best ? `${best.rolls} / ${formatTime(best.timeSeconds)}` : "—"}
        </div>
      </div>
    </section>
  )
}
