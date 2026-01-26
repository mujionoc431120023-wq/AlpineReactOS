import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertFile, type File } from "@shared/schema";

export function useFileSystem(path?: string) {
  return useQuery({
    queryKey: [api.fs.list.path, path],
    queryFn: async () => {
      const url = path ? `${api.fs.list.path}?path=${encodeURIComponent(path)}` : api.fs.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch file system");
      return api.fs.list.responses[200].parse(await res.json());
    },
  });
}

export function useFileContent(id: number | null) {
  return useQuery({
    queryKey: [api.fs.getContent.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.fs.getContent.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch file content");
      return api.fs.getContent.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFile) => {
      const res = await fetch(api.fs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create file");
      return api.fs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.fs.list.path] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertFile>) => {
      const url = buildUrl(api.fs.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update file");
      return api.fs.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.fs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.fs.getContent.path, data.id] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.fs.delete.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.fs.list.path] });
    },
  });
}
