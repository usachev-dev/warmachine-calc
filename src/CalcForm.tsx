import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactElement,
  type SubmitEvent,
} from "react";
import { type Calc, type CalcIn } from "./Calc";

type CalcFormRowProps = {
  id: string;
  label: string;
  type: "number" | "text";
  value: string | number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

function CalcFormRow({
  id,
  label,
  type,
  value,
  onChange,
  placeholder = label,
}: CalcFormRowProps): ReactElement {
  return (
    <div className="calc-form-block-row">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
}

export function CalcForm(): ReactElement {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  let [calcForm, setCalcForm] = useState<CalcIn>({
    attackers: [{ stats: { attacks: "1", skill: 6, pow: 10 } }],
    defenders: {
      stats: { def: 12, arm: 18, hp: 30, impervious: false },
      count: 1,
    },
  });

  const sendForm = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const res = await fetch("/api/hello", {
        method: "POST",
        body: JSON.stringify(calcForm),
      });

      const data = await res.json();
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="calc">
      <h1>Warmachine Calculator</h1>
      <form onSubmit={sendForm} className="calc-form">
        <h2>Attackers</h2>
        {calcForm.attackers.map((a, index) => (
          <fieldset className="calc-form-block" key={index}>
            <CalcFormRow
              id={"atk" + index}
              label="ATK"
              type="text"
              value={calcForm.attackers[index]?.stats?.attacks}
              onChange={(e) =>
                setCalcForm({
                  ...calcForm,
                  attackers: calcForm.attackers.map((a, i) =>
                    i === index
                      ? {
                          ...a,
                          stats: {
                            ...a.stats,
                            attacks: e.target.value,
                          },
                        }
                      : a,
                  ),
                })
              }
              placeholder="at"
            />
            <CalcFormRow
              id={"skill" + index}
              label="skill"
              type="number"
              value={calcForm.attackers[index]?.stats?.skill}
              onChange={(e) =>
                setCalcForm({
                  ...calcForm,
                  attackers: calcForm.attackers.map((a, i) =>
                    i === index
                      ? {
                          ...a,
                          stats: {
                            ...a.stats,
                            skill: Number(e.target.value),
                          },
                        }
                      : a,
                  ),
                })
              }
            />
            <div className="calc-form-block-row">
              <label htmlFor="boostATK">boost attack</label>
              <input
                type="checkbox"
                id="boostATK"
                checked={calcForm.attackers[index]?.stats?.boostATK}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    attackers: calcForm.attackers.map((a, i) =>
                      i === index
                        ? {
                            ...a,
                            stats: {
                              ...a.stats,
                              boostATK: e.target.checked,
                            },
                          }
                        : a,
                    ),
                  })
                }
              />
            </div>
            <CalcFormRow
              id={"pow" + index}
              label="pow"
              type="number"
              value={calcForm.attackers[index]?.stats?.pow}
              onChange={(e) =>
                setCalcForm({
                  ...calcForm,
                  attackers: calcForm.attackers.map((a, i) =>
                    i === index
                      ? {
                          ...a,
                          stats: {
                            ...a.stats,
                            pow: Number(e.target.value),
                          },
                        }
                      : a,
                  ),
                })
              }
            />
            <div className="calc-form-block-row">
              <label htmlFor="boostDMG">boost dmg</label>
              <input
                type="checkbox"
                id="boostDMG"
                checked={calcForm.attackers[index]?.stats?.boostDMG}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    attackers: calcForm.attackers.map((a, i) =>
                      i === index
                        ? {
                            ...a,
                            stats: {
                              ...a.stats,
                              boostDMG: e.target.checked,
                            },
                          }
                        : a,
                    ),
                  })
                }
              />
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() =>
            setCalcForm({
              ...calcForm,
              attackers: [
                ...calcForm.attackers,
                { stats: { attacks: "1", skill: 6, pow: 10 } },
              ],
            })
          }
        >
          +
        </button>

        <h2>Defenders</h2>

        <fieldset className="calc-form-block">
          <CalcFormRow
            id="defenders-def"
            label="def"
            type="number"
            value={calcForm.defenders.stats.def}
            onChange={(e) =>
              setCalcForm({
                ...calcForm,
                defenders: {
                  ...calcForm.defenders,
                  stats: {
                    ...calcForm.defenders.stats,
                    def: Number(e.target.value),
                  },
                },
              })
            }
          />

          <CalcFormRow
            id="defenders-arm"
            label="arm"
            type="number"
            value={calcForm.defenders.stats.arm}
            onChange={(e) =>
              setCalcForm({
                ...calcForm,
                defenders: {
                  ...calcForm.defenders,
                  stats: {
                    ...calcForm.defenders.stats,
                    arm: Number(e.target.value),
                  },
                },
              })
            }
          />
          <CalcFormRow
            id="defenders-arm"
            label="hp"
            type="number"
            value={calcForm.defenders.stats.hp}
            onChange={(e) =>
              setCalcForm({
                ...calcForm,
                defenders: {
                  ...calcForm.defenders,
                  stats: {
                    ...calcForm.defenders.stats,
                    hp: Number(e.target.value),
                  },
                },
              })
            }
          />
          <div className="calc-form-block-row">
            <label htmlFor="impervious">impervious</label>
            <input
              type="checkbox"
              id="impervious"
              checked={calcForm.defenders.stats.impervious}
              onChange={(e) =>
                setCalcForm({
                  ...calcForm,
                  defenders: {
                    ...calcForm.defenders,
                    stats: {
                      ...calcForm.defenders.stats,
                      impervious: e.target.checked,
                    },
                  },
                })
              }
            />
          </div>
          <CalcFormRow
            id="defenders-count"
            label="count"
            type="number"
            value={calcForm.defenders.count}
            onChange={(e) =>
              setCalcForm({
                ...calcForm,
                defenders: {
                  ...calcForm.defenders,
                  count: Number(e.target.value),
                },
              })
            }
          />
        </fieldset>

        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <textarea
        ref={responseInputRef}
        readOnly
        placeholder="Response will appear here..."
        className="response-area"
      />
    </div>
  );
}
