import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
    const [supabaseClient] = useState(() => createPagesBrowserClient());
    const router = useRouter();
    return (
        <PlasmicComponent
            forceOriginal
            component="AuthForm"
            componentProps={{
                handleSubmit: async (
                    mode: "signIn" | "signUp",
                    credentials: {
                        email: string;
                        password: string;
                    }
                ) => {
                    let token = null;
                    if (mode === "signIn") {
                        const signInResponse = await supabaseClient.auth.signInWithPassword(credentials);
                        console.log('signInResponse', signInResponse);
                        token = signInResponse?.data?.session?.access_token;
                        console.log('token', token);
                    } else {
                        await supabaseClient.auth.signUp(credentials);
                    }
                    const mutateResponse = await mutate(PLASMIC_AUTH_DATA_KEY);

                    if (mutateResponse && mutateResponse.plasmicUser) {
                        mutateResponse.plasmicUser.token = token;
                    }
                    console.log('mutateResponse', mutateResponse);

                    router.push("/");
                },
            }}
        />
    );
}