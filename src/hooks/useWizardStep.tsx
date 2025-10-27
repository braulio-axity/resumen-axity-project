import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Options = {
  totalSteps: number;
  canEnter?: (index0: number) => boolean;
  onStepChange?: (index0: number) => void;
};


export function useWizardStepRouter({ totalSteps, canEnter, onStepChange }: Options) {
  const navigate = useNavigate();
  const { step: stepParam } = useParams<{ step: string }>();

  const index0 = useMemo(() => {
    const n = Number(stepParam);
    const s = Number.isFinite(n) ? n : 1;
    const clamped = Math.min(Math.max(s, 1), totalSteps);
    const idx = clamped - 1;
    if (canEnter && !canEnter(idx)) {
      for (let k = idx; k >= 0; k--) {
        if (canEnter(k)) {
          navigate(`/wizard/${k + 1}`, { replace: true });
          onStepChange?.(k);
          return k;
        }
      }
      navigate(`/wizard/1`, { replace: true });
      onStepChange?.(0);
      return 0;
    }
    onStepChange?.(idx);
    return idx;
  }, [stepParam, totalSteps, canEnter, navigate, onStepChange]);

  const setStep = useCallback((idx0: number, replace = false) => {
    const clamped = Math.min(Math.max(idx0, 0), totalSteps - 1);
    navigate(`/wizard/${clamped + 1}`, { replace });
  }, [navigate, totalSteps]);

  const goNext = useCallback(() => setStep(index0 + 1), [index0, setStep]);
  const goPrev = useCallback(() => setStep(index0 - 1), [index0, setStep]);

  return { stepIndex: index0, setStep, goNext, goPrev };
}
