"use client";

import { useEffect, useCallback } from "react";
import Script from "next/script";
import { useUserStore } from "../store/snapStore";

/* =========================
   Types
========================= */

interface Bitmoji {
  avatar: string;
}

interface SnapUser {
  displayName: string;
  bitmoji: Bitmoji;
  externalId: string;
}

interface AppUser extends SnapUser {
  avatarOverride: string;
}

/* =========================
   Extend Window
========================= */

declare global {
  interface Window {
    snapKitInit?: () => void;
    snap?: {
      loginkit?: {
        mountButton: (
          elementId: string,
          options: {
            clientId: string;
            redirectURI: string;
            scopeList: string[];
            handleResponseCallback: () => void;
          },
        ) => void;
        fetchUserInfo: () => Promise<{
          data: {
            me: SnapUser;
          };
        }>;
      };
    };
  }
}

/* =========================
   Component
========================= */

export default function SnapLogin() {
  const login = useUserStore((state) => state.login);
  const user = useUserStore((state) => state.user);

  const initSnap = useCallback((): void => {
    window.snapKitInit = () => {
      if (window.snap?.loginkit) {
        window.snap.loginkit.mountButton("my-login-button-target", {
          clientId: "fea9413d-7f14-4aff-b5ae-fbec1a3824cd",
          redirectURI:
            "https://knowmie-final--knowmie-web-front.us-central1.hosted.app/",
          scopeList: ["user.display_name", "user.bitmoji.avatar"],
          handleResponseCallback: () => {
            window.snap?.loginkit?.fetchUserInfo().then((result) => {
              const userData = result.data.me;

              login(userData);
            });
          },
        });
      }
    };

    if (window.snap?.loginkit && window.snapKitInit) {
      window.snapKitInit();
    }
  }, [login]);

  useEffect(() => {
    initSnap();
  }, [initSnap]);

  return (
    <div>
      <Script
        src="https://sdk.snapkit.com/js/v1/login.js"
        strategy="beforeInteractive"
        onLoad={initSnap}
      />

      {user ? (
        <div className="profile">
          <h2>{user.displayName}</h2>
        </div>
      ) : null}
    </div>
  );
}
