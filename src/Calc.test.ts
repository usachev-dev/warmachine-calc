import {
  attackerInToAttacker,
  parseDieRoll,
  rolld6,
  rollDice,
  rollDX,
  Roller,
} from "./Calc";
import { expect, test } from "bun:test";

test("rolld6", () => {
  for (let i = 0; i < 100; i++) {
    const result = rolld6();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  }
});

test("parseDieRoll", () => {
  const result = parseDieRoll("2d6+3");
  expect(result.count).toBe(2);
  expect(result.d).toBe(6);
  expect(result.plus).toBe(3);
});

test("rollDX", () => {
  for (let i = 0; i < 100; i++) {
    let result = rollDX(6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
    result = rollDX(3);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(3);
    result = rollDX(2);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2);
  }
});

test("rollDice", () => {
  for (let i = 0; i < 100; i++) {
    let result = rollDice({ count: 2, d: 6, plus: 3 });
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(15);
  }
});

test("attackerInToAttacker", () => {
  expect(attackerInToAttacker({ attacks: "2", skill: 3, pow: 4 }).attacks).toBe(
    "2",
  );
  for (let i = 0; i < 100; i++) {
    let a = attackerInToAttacker({ attacks: "d3", skill: 3, pow: 4 }).attacksN;
    expect(a).toBeNumber();
    expect(a).toBeGreaterThanOrEqual(1);
    expect(a).toBeLessThanOrEqual(3);
  }
  for (let i = 0; i < 100; i++) {
    let a = attackerInToAttacker({
      attacks: "2d6+3",
      skill: 3,
      pow: 4,
    }).attacksN;
    expect(a).toBeNumber();
    expect(a).toBeGreaterThanOrEqual(5);
    expect(a).toBeLessThanOrEqual(15);
  }
});

test("ROLLERrolld6", () => {
  let roller = new Roller();
  for (let i = 0; i < 9999; i++) {
    const result = roller.rolld6();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  }
});

test("ROLLERroll2d6", () => {
  let roller = new Roller();
  for (let i = 0; i < 9999; i++) {
    const result = roller.roll2d6();
    expect(result).toBeGreaterThanOrEqual(2);
    expect(result).toBeLessThanOrEqual(12);
  }
});

test("ROLLERroll3d6", () => {
  let roller = new Roller();
  for (let i = 0; i < 9999; i++) {
    const result = roller.roll3d6();
    expect(result).toBeGreaterThanOrEqual(3);
    expect(result).toBeLessThanOrEqual(18);
  }
});
