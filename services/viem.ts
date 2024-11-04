import { u2uNetwork } from "@/config/wagmi";
import { createPublicClient, http } from "viem";

const viemClient = createPublicClient({
  chain: u2uNetwork,
  transport: http(),
});

export default viemClient;
