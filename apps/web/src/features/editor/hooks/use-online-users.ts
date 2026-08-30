import { useEffect, useState } from "react";
import type { HocuspocusProvider } from "@hocuspocus/provider";

export interface OnlineUser {
  clientId: number;
  name: string;
  color: string;
}

export function useOnlineUsers(provider: HocuspocusProvider) {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const { awareness } = provider;

    if (!awareness) {
      return;
    }

    const read = () => {
      const next: OnlineUser[] = [];

      awareness.getStates().forEach((state, clientId) => {
        const user = (state as { user?: { name?: string; color?: string } }).user;
        if (user?.name) {
          next.push({
            clientId,
            name: user.name,
            color: user.color ?? "var(--color-ink-subtle)",
          });
        }
      });

      setUsers(next);
    };

    read();
    awareness.on("change", read);

    return () => {
      awareness.off("change", read);
    };
  }, [provider]);

  return users;
}
