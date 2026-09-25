export type Who = "any" | "just-me" | "group";
export type DineOption = "any" | "dine-in" | "takeaway";
export type WalkingDistance = "any" | 5 | 10 | 15 | 20;
export type Budget = "any" | "under-8" | "8-15" | "15-30" | "30-plus";
export type Hunger =
  | "any"
  | "just-a-drink"
  | "just-a-snack"
  | "a-proper-meal"
  | "starving";
export type Feeling =
  | "any"
  | "comfort"
  | "something-healthy"
  | "something-sweet"
  | "something-new";

export type Answers = {
  who: Who;
  groupSize: number;
  dineOption: DineOption;
  walkingDistance: WalkingDistance;
  budget: Budget;
  hunger: Hunger;
  feeling: Feeling;
  cuisines: string[];
  openNow: boolean;
};

export const DEFAULT_ANSWERS: Answers = {
  who: "any",
  groupSize: 2,
  dineOption: "any",
  walkingDistance: 10,
  budget: "any",
  hunger: "any",
  feeling: "any",
  cuisines: [],
  openNow: true,
};

export const FOOD_CUISINES = [
  "Chinese",
  "Malay",
  "Indian",
  "Western",
  "Japanese",
  "Korean",
  "Thai",
  "Italian",
  "Vegetarian",
  "Desserts",
] as const;

export const DRINK_OPTIONS = [
  "Coffee",
  "Tea",
  "Bubble tea",
  "Juice & smoothies",
  "Beer",
  "Cocktails & wine",
] as const;
