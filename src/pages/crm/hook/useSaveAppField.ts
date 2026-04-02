import { useAppFields } from "@/api";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { useAppFieldStore } from "../store/useAppFieldStore";

export const useSaveAppField = () => {
  const { selectedApp } = useAuthStore();
  const { setAppFields } = useAppFieldStore();
  const { data, isSuccess } = useAppFields(selectedApp?.id || "");

  useEffect(() => {
    if (isSuccess) {
      setAppFields(data);
    }
  }, [data, isSuccess, setAppFields]);
};
