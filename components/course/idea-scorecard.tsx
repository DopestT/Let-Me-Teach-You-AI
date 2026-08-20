"use client";

import { useMemo, useState } from "react";

const criteria = [
  { key: "urgency", label: "Urgency" },
  { key: "frequency", label: "Frequency" },
  { key: "willingness", label: "Will pay" },
  { key: "reachability", label: "Easy to reach" },
  { key: "aiLeverage", label: "AI leverage" },
] as const;

type CriterionKey = (typeof criteria)[number]["key"];
type Idea = { name: string } & Record<CriterionKey, number>;

const blankIdea = (): Idea => ({
  name: "",
  urgency: 1,
  frequency: 1,
  willingness: 1,
  reachability: 1,
  aiLeverage: 1,
});

export function IdeaScorecard() {
  const [ideas, setIdeas] = useState<Idea[]>([blankIdea(), blankIdea(), blankIdea()]);

  const totals = useMemo(
    () =>
      ideas.map((idea) =>
        criteria.reduce((sum, criterion) => sum + idea[criterion.key], 0)
      ),
    [ideas]
  );

  function updateName(index: number, name: string) {
    setIdeas((current) => current.map((idea, i) => (i === index ? { ...idea, name } : idea)));
  }

  function updateScore(index: number, key: CriterionKey, value: number) {
    setIdeas((current) =>
      current.map((idea, i) => (i === index ? { ...idea, [key]: value } : idea))
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#cfdcf6] bg-white shadow-sm">
      <div className="border-b border-[#dfe6f0] bg-[#f7f9ff] px-5 py-5 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[#2457ff]">Interactive worksheet</p>
        <h3 className="mt-2 font-editorial text-3xl font-semibold text-[#0f1e3d]">Score three ideas before choosing one.</h3>
        <p className="mt-3 max-w-2xl leading-7 text-[#59677c]">Give each idea a 1–5 score. Do not use the total as proof of demand — use it to decide which idea deserves your first real-world test.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e4e9f2] text-xs font-bold uppercase tracking-[.08em] text-[#6a7da3]">
              <th className="px-5 py-4">Idea</th>
              {criteria.map((criterion) => (
                <th key={criterion.key} className="px-3 py-4 text-center">{criterion.label}</th>
              ))}
              <th className="px-5 py-4 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea, index) => (
              <tr key={index} className="border-b border-[#edf0f5] last:border-0">
                <td className="px-5 py-4">
                  <input
                    value={idea.name}
                    onChange={(event) => updateName(index, event.target.value)}
                    placeholder={`Idea ${index + 1}`}
                    aria-label={`Idea ${index + 1} name`}
                    className="w-48 rounded-xl border border-[#d7deea] bg-white px-3 py-2.5 text-sm font-semibold text-[#0f1e3d] placeholder:text-[#98a3b6]"
                  />
                </td>
                {criteria.map((criterion) => (
                  <td key={criterion.key} className="px-3 py-4 text-center">
                    <select
                      value={idea[criterion.key]}
                      onChange={(event) => updateScore(index, criterion.key, Number(event.target.value))}
                      aria-label={`${idea.name || `Idea ${index + 1}`} ${criterion.label} score`}
                      className="rounded-xl border border-[#d7deea] bg-white px-3 py-2 text-sm font-bold text-[#33456e]"
                    >
                      {[1, 2, 3, 4, 5].map((score) => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-12 justify-center rounded-full bg-[#eaf0ff] px-3 py-2 font-black text-[#2457ff]">{totals[index]}/25</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 border-t border-[#dfe6f0] bg-[#fbfcff] px-5 py-5 text-sm text-[#526078] sm:grid-cols-3 sm:px-7">
        <p><strong className="text-[#0f1e3d]">1–12:</strong> weak candidate; learn more before building.</p>
        <p><strong className="text-[#0f1e3d]">13–18:</strong> worth validating with real people.</p>
        <p><strong className="text-[#0f1e3d]">19–25:</strong> strong hypothesis — still not proof until customers confirm it.</p>
      </div>
    </div>
  );
}
