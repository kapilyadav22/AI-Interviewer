import { memo } from "react";

export const AnalysisResult = memo(function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="mt-6 space-y-4 text-slate-900 dark:text-slate-300">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        Analysis Result
      </h3>
      <p>
        <strong>Score:</strong> {analysis.score ?? "N/A"}
      </p>
      <p>
        <strong>Strengths:</strong> {analysis.strengths?.join(", ")}
      </p>
      <p>
        <strong>Weaknesses:</strong> {analysis.weaknesses?.join(", ")}
      </p>
      <div>
        <h4 className="font-medium text-slate-900 dark:text-white">
          Suggestions
        </h4>
        <ul className="list-disc list-inside space-y-2">
          {analysis.suggestions?.map((s, i) => (
            <li key={i}>
              <p>
                <strong className="text-slate-900 dark:text-white">
                  Original:
                </strong>{" "}
                {s.original}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">
                  Improved:
                </strong>{" "}
                {s.improved}
              </p>
              <p>
                <em className="text-slate-600 dark:text-slate-400">
                  {s.reason}
                </em>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
