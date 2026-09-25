"use client";

import { useState } from "react";
import {
  DEFAULT_ANSWERS,
  FOOD_CUISINES,
  DRINK_OPTIONS,
  type Answers,
  type Who,
  type DineOption,
  type WalkingDistance,
  type Budget,
  type Hunger,
  type Feeling,
} from "@/types";
import styles from "./page.module.css";

export default function Home() {
  const [answers, setAnswers] = useState<Answers>({ ...DEFAULT_ANSWERS });

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const isDrinkMode = answers.hunger === "just-a-drink";

  const toggleCuisine = (cuisine: string) => {
    setAnswers((prev) => {
      const has = prev.cuisines.includes(cuisine);
      return {
        ...prev,
        cuisines: has
          ? prev.cuisines.filter((c) => c !== cuisine)
          : [...prev.cuisines, cuisine],
      };
    });
  };

  const setHunger = (value: Hunger) => {
    const wasDrink = answers.hunger === "just-a-drink";
    const willBeDrink = value === "just-a-drink";
    setAnswers((prev) => ({
      ...prev,
      hunger: value,
      cuisines: wasDrink !== willBeDrink ? [] : prev.cuisines,
    }));
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Crave What</h1>

      {/* Q1: Who's eating? */}
      <Question label="Who's eating?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: "just-me", label: "Just me" },
            { value: "group", label: "Group" },
          ]}
          selected={answers.who}
          onSelect={(v) => update("who", v as Who)}
        />
        {answers.who === "group" && (
          <Stepper
            value={answers.groupSize}
            min={2}
            max={10}
            onChange={(v) => update("groupSize", v)}
          />
        )}
      </Question>

      {/* Q2: Eating there or taking away? */}
      <Question label="Eating there or taking away?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: "dine-in", label: "Dine in" },
            { value: "takeaway", label: "Takeaway" },
          ]}
          selected={answers.dineOption}
          onSelect={(v) => update("dineOption", v as DineOption)}
        />
      </Question>

      {/* Q3: How far? */}
      <Question label="How far are you willing to walk?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: 5, label: "5 min" },
            { value: 10, label: "10 min" },
            { value: 15, label: "15 min" },
            { value: 20, label: "20 min" },
          ]}
          selected={answers.walkingDistance}
          onSelect={(v) => update("walkingDistance", v as WalkingDistance)}
        />
      </Question>

      {/* Q4: Budget */}
      <Question label="How much do you want to spend?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: "under-8", label: "Under $8" },
            { value: "8-15", label: "$8–15" },
            { value: "15-30", label: "$15–30" },
            { value: "30-plus", label: "$30+" },
          ]}
          selected={answers.budget}
          onSelect={(v) => update("budget", v as Budget)}
        />
      </Question>

      {/* Q5: Hunger */}
      <Question label="How hungry are you?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: "just-a-drink", label: "Just a drink" },
            { value: "just-a-snack", label: "Just a snack" },
            { value: "a-proper-meal", label: "A proper meal" },
            { value: "starving", label: "Starving" },
          ]}
          selected={answers.hunger}
          onSelect={(v) => setHunger(v as Hunger)}
        />
      </Question>

      {/* Q6: Feeling */}
      <Question label="What are you feeling?">
        <ChipGroup
          options={[
            { value: "any", label: "Any" },
            { value: "comfort", label: "Comfort" },
            { value: "something-healthy", label: "Something healthy" },
            { value: "something-sweet", label: "Something sweet" },
            { value: "something-new", label: "Something new" },
          ]}
          selected={answers.feeling}
          onSelect={(v) => update("feeling", v as Feeling)}
        />
      </Question>

      {/* Q7: Cuisine / Drink */}
      <Question label={isDrinkMode ? "What drink?" : "What cuisine?"}>
        <MultiChipGroup
          options={isDrinkMode ? [...DRINK_OPTIONS] : [...FOOD_CUISINES]}
          selected={answers.cuisines}
          onToggle={toggleCuisine}
          onClear={() => update("cuisines", [])}
        />
      </Question>

      {/* Open now toggle */}
      <div className={styles.toggleRow}>
        <label className={styles.toggleLabel} htmlFor="open-now">
          Only show places open now
        </label>
        <button
          id="open-now"
          role="switch"
          aria-checked={answers.openNow}
          className={`${styles.toggle} ${answers.openNow ? styles.toggleOn : ""}`}
          onClick={() => update("openNow", !answers.openNow)}
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {/* Sticky button */}
      <div className={styles.stickyBottom}>
        <button
          className={styles.pickButton}
          onClick={() => alert("Coming in milestone 3!")}
        >
          Pick for me
        </button>
      </div>
    </main>
  );
}

/* ── Sub-components ── */

function Question({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.question}>
      <h2 className={styles.questionLabel}>{label}</h2>
      {children}
    </section>
  );
}

function ChipGroup<T extends string | number>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className={styles.chips} role="radiogroup">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          role="radio"
          aria-checked={selected === opt.value}
          className={`${styles.chip} ${selected === opt.value ? styles.chipSelected : ""}`}
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiChipGroup({
  options,
  selected,
  onToggle,
  onClear,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const noneSelected = selected.length === 0;
  return (
    <div className={styles.chips} role="group">
      <button
        role="checkbox"
        aria-checked={noneSelected}
        className={`${styles.chip} ${noneSelected ? styles.chipSelected : ""}`}
        onClick={onClear}
      >
        Any
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          role="checkbox"
          aria-checked={selected.includes(opt)}
          className={`${styles.chip} ${selected.includes(opt) ? styles.chipSelected : ""}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.stepper}>
      <button
        className={styles.stepperButton}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease group size"
        disabled={value <= min}
      >
        −
      </button>
      <span className={styles.stepperValue}>
        {value}{value >= max ? "+" : ""}
      </span>
      <button
        className={styles.stepperButton}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase group size"
        disabled={value >= max}
      >
        +
      </button>
      <span className={styles.stepperLabel}>people</span>
    </div>
  );
}
