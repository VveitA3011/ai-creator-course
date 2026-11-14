"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { clearLocal } from "@/lib/local";
import { accountsEnabled, supabase, type Profile } from "@/lib/supabase";
import { SyncEngine, type SyncStatus } from "@/lib/sync";

type AuthState = {
  enabled: boolean;
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  recovering: boolean;
  sync: SyncStatus;
  syncNow: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const idle: SyncStatus = { state: "idle", lastSync: null };
const Ctx = createContext<AuthState>({
  enabled: false,
  loading: false,
  user: null,
  profile: null,
  recovering: false,
  sync: idle,
  syncNow: async () => {},
  reloadProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(accountsEnabled);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [sync, setSync] = useState<SyncStatus>(idle);
  const engine = useRef<SyncEngine | null>(null);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) return setProfile(null);
    const { data } = await supabase().from("profiles").select("*").eq("id", u.id).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    if (!accountsEnabled) return;
    const db = supabase();
    let unsubSync: (() => void) | undefined;

    let attachedId: string | null = null;
    const attach = (u: User | null) => {
      if ((u?.id ?? null) === attachedId) return;
      engine.current?.stop();
      unsubSync?.();
      engine.current = null;
      attachedId = u?.id ?? null;
      if (u) {
        const e = new SyncEngine(u.id);
        engine.current = e;
        unsubSync = e.subscribe(setSync);
        e.start();
      } else {
        setSync(idle);
      }
    };

    db.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      attach(u);
      loadProfile(u).finally(() => setLoading(false));
    });

    const { data: sub } = db.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "PASSWORD_RECOVERY") {
        setUser(u);
        // Gọi cơ sở dữ liệu ngay trong hàm lắng nghe này có thể làm thư viện Supabase bị kẹt,
        // nên dời sang lượt chạy kế tiếp (theo khuyến nghị trong tài liệu của Supabase).
        setTimeout(() => {
          attach(u);
          loadProfile(u);
        }, 0);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
      engine.current?.stop();
      unsubSync?.();
    };
  }, [loadProfile]);

  const value: AuthState = {
    enabled: accountsEnabled,
    loading,
    user,
    profile,
    recovering,
    sync,
    syncNow: async () => engine.current?.syncNow(),
    reloadProfile: async () => loadProfile(user),
    signOut: async () => {
      // Đẩy nốt thay đổi chưa đồng bộ trước khi xóa dữ liệu khỏi trình duyệt này
      await engine.current?.syncNow();
      await supabase().auth.signOut();
      clearLocal();
      setRecovering(false);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
