import { DataProvider } from '@plasmicapp/loader-nextjs';
import { ReactNode, useEffect, useState } from 'react';
import useSWR from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "../utils/cache-keys";

export function TokenProvider(props: { children?: ReactNode; className?: string; }) {
  const { children, className } = props;
  const { isUserLoading, plasmicUserToken, plasmicUser } = usePlasmicAuthData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className={className}>
      {
        // Make this data available to this subtree via context,
        // with the name "product"
      }
      <DataProvider name="token" data={plasmicUserToken || null}>
        {children}
      </DataProvider>
    </div>
  );
}

function usePlasmicAuthData() {
  const { isLoading, data } = useSWR(PLASMIC_AUTH_DATA_KEY, async () => {
    const data = await fetch("/api/plasmic-auth").then((r) => r.json());
    return data;
  });
  return {
    isUserLoading: isLoading,
    plasmicUser: data?.plasmicUser,
    plasmicUserToken: data?.plasmicUserToken,
  };
}