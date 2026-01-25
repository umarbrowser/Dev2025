import styles from "./Die.module.css"

function Pips({ value }) {
  return (
    <span className={styles.pips} data-value={value} aria-hidden="true">
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
      <span className={styles.pip} />
    </span>
  )
}

export default function Die({ value, isHeld, onToggleHold, index }) {
  return (
    <button
      type="button"
      className={`${styles.die} ${isHeld ? styles.held : ""}`}
      onClick={onToggleHold}
      aria-pressed={isHeld}
      aria-label={`Die ${index + 1} showing ${value}, ${isHeld ? "held" : "not held"}`}
      title={isHeld ? "Held" : "Click to hold"}
    >
      <Pips value={value} />
      <span className={styles.value} aria-hidden="true">
        {value}
      </span>
    </button>
  )
}
