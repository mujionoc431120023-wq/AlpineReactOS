import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertSettings } from "@shared/schema";

export function useSystemExecute() {
  return useMutation({
    mutationFn: async (data: { command: string; args: string[]; cwd: string }) => {
      const res = await fetch(api.system.execute.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to execute command");
      return api.system.execute.responses[200].parse(await res.json());
    },
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: [api.system.settings.get.path],
    queryFn: async () => {
      const res = await fetch(api.system.settings.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.system.settings.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<InsertSettings>) => {
      const res = await fetch(api.system.settings.update.path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return api.system.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.system.settings.get.path] });
    },
  });
}
