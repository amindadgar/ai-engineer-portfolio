import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import type { GitHubSummary } from "../../worker/src/types";

export type { GitHubSummary };

type State =
  | { status: "loading" }
  | { status: "ready"; summary: GitHubSummary }
  | { status: "unavailable" };

export const useGitHubSummary = (): State => {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/github-summary`, { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<GitHubSummary>) : Promise.reject(response.status)))
      .then((summary) => setState({ status: "ready", summary }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "unavailable" });
      });
    return () => controller.abort();
  }, []);

  return state;
};
