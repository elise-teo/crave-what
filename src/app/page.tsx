import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Crave What</h1>
      <p className={styles.subtitle}>What are you hungry for?</p>
    </main>
  );
}
