"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTimestamp } from "@cards/utils";
import UsernameContainer from "@/components/UsernameContainer";

const GameBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async (jwt: string) => {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (res.status === 200) {
          router.push("/game");
        } else {
          localStorage.removeItem("cggame-sess");
        }
      } catch (e) {
        localStorage.removeItem("cggame-sess");
      }
    };

    const jwt = localStorage.getItem("cggame-sess");
    if (jwt) {
      fetchMe(jwt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnection = async (username: string) => {
    try {
      setLoading(true);

      const { token } = await (
        await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username }),
        })
      ).json();

      localStorage.setItem("cggame-sess", token);

      router.push(`/game`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nickname-zone flex min-h-[392px] items-center justify-center pb-6 pt-8">
      <div className="flex max-w-3xl flex-wrap items-center justify-center">
        <div className="avatar-container max-w-full grow-0 basis-full p-2">
          <div className="pb-4">
            <div className="flex items-center justify-center">
              <div className="badge relative inline-flex shrink-0 align-middle">
                <div className="bg-[rgba(255,255,255, 0.12)] relative flex aspect-square h-36 w-36 items-center justify-center rounded-[50%]">
                  <Image
                    src={`https://api.multiavatar.com/${encodeURIComponent(
                      getTimestamp()
                    )}.png`}
                    width={144}
                    height={144}
                    alt="Avatar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <UsernameContainer
          onChange={(val) => handleConnection(val)}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default GameBar;
