// src/hooks/useCvSkills.ts
import { useCallback, useEffect, useState } from "react";
import { addCvSkill, deleteCvSkill, listCvSkills, updateCvSkill, type CvSkillView, bulkReplaceCvSkills } from "@/api/cvSkills";

export function useCvSkills() {
  const [items, setItems] = useState<CvSkillView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await listCvSkills();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const add = useCallback(async (name: string, level: string, version?: string) => {
    const created = await addCvSkill({ name, version, level });
    setItems(prev => {
      const idx = prev.findIndex(i => i.skill.id === created.skill.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = created;
        return clone;
      }
      return [created, ...prev];
    });
  }, []);

  const update = useCallback(async (cvSkillId: string, level: string) => {
    const updated = await updateCvSkill(cvSkillId, level);
    setItems(prev => prev.map(i => i.id === cvSkillId ? updated : i));
  }, []);

  const remove = useCallback(async (cvSkillId: string) => {
    await deleteCvSkill(cvSkillId);
    setItems(prev => prev.filter(i => i.id !== cvSkillId));
  }, []);

  const replaceAll = useCallback(async (skills: { name: string; version?: string; level: string }[]) => {
    const list = await bulkReplaceCvSkills(skills);
    setItems(list);
  }, []);

  return { items, loading, error, refresh, add, update, remove, replaceAll };
}
