import { APIResponse } from "@/services/api/types";
import { User } from "@/types";

export interface AuthStoreState {
  profile: User | null;
}

export interface AuthStoreAction {
  setProfile: (profile: User) => void;
}
