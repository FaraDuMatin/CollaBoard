import { useState } from "react";
import { useMutation } from "convex/react";
import { mutation } from "@/convex/_generated/server";

export const useApiMutation = (mutationFunction : any) => {
    const [isLoading, setIsLoading] = useState(false);
    const apiMutation = useMutation(mutationFunction);

    const mutate = (payload: any) => {
        setIsLoading(true);
        return apiMutation(payload).finally(() => {
            setIsLoading(false);
        })
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => {
            throw error;
        });
    };
    return { mutate, isLoading };
};