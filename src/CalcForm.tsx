import { useRef, useState, type SubmitEvent } from "react";
import { type Calc } from "./Calc";

export function CalcForm() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  let [calcForm, setCalcForm] = useState<Calc>({
    attackers: [{ stats: { attacks: "1", skill: 6, pow: 10 }, count: 1 }],
    defenders: { stats: { def: 12, arm: 18, hp: 30 }, count: 1 },
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
          <fieldset className="calc-form-block">
            <div className="calc-form-block-row">
              <label htmlFor={"atk" + index}>ATK</label>
              <input
                type="text"
                id={"atk" + index}
                value={calcForm.attackers[index]?.stats?.attacks}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    attackers: calcForm.attackers.map((a, i) =>
                      i === index
                        ? {
                            ...a,
                            stats: { ...a.stats, attacks: e.target.value },
                          }
                        : a,
                    ),
                  })
                }
                className="input"
                placeholder="at"
              />
            </div>
            <div className="calc-form-block-row">
              <label htmlFor={"skill" + index}>skill</label>
              <input
                type="number"
                id={"skill" + index}
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
                className="input"
                placeholder="skill"
              />
            </div>
            <div className="calc-form-block-row">
              <label htmlFor={"pow" + index}>pow</label>
              <input
                type="number"
                id={"pow" + index}
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
                className="input"
                placeholder="pow"
              />
            </div>
            <div className="calc-form-block-row">
              <label htmlFor={"count" + index}>count</label>
              <input
                type="number"
                id={"count" + index}
                value={calcForm.attackers[index]?.count}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    attackers: calcForm.attackers.map((a, i) =>
                      i === index
                        ? {
                            ...a,
                            stats: {
                              ...a.stats,
                              count: Number(e.target.value),
                            },
                          }
                        : a,
                    ),
                  })
                }
                className="input"
                placeholder="count"
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
                { stats: { attacks: "1", skill: 6, pow: 10 }, count: 1 },
              ],
            })
          }
        >
          +
        </button>

        <h2>Defenders</h2>

        <fieldset className="calc-form-block">
          <div className="calc-form-block-row">
            <label htmlFor="defenders-def">def</label>
            <input
              type="number"
              id="defenders-def"
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
              className="input"
              placeholder="def"
            />
          </div>

          <div className="calc-form-block-row">
            <label htmlFor="defenders-arm">arm</label>
            <input
              type="number"
              id="defenders-arm"
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
              className="input"
              placeholder="arm"
            />
          </div>
          <div className="calc-form-block-row">
            <label htmlFor="defenders-count">count</label>
            <input
              type="number"
              id="defenders-count"
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
              className="input"
              placeholder="count"
            />
          </div>
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
