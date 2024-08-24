import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import {
  Address,
  readContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { TransactionReceipt } from "viem";
import { getUserLocale } from "./locale";
import { getWeb3ErrorMsg } from "@/utils/transaction";

async function write<
  abi extends Abi,
  functionName extends ExtractAbiFunctionNames<abi, "payable" | "nonpayable">,
  abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>
>(config: {
  abi: abi;
  address: Address;
  functionName:
    | functionName
    | ExtractAbiFunctionNames<abi, "payable" | "nonpayable">;
  value?: bigint;
  args: AbiParametersToPrimitiveTypes<abiFunction["inputs"], "inputs">;
}): Promise<TransactionReceipt> {
  try {
    const { address, abi, functionName, args, value } = config;
    const tx = await writeContract({
      address,
      abi: abi as any,
      functionName,
      args: args as any,
      value,
    });
    const response = await waitForTransaction(tx);
    return response;
  } catch (err: any) {
    const errMsg = await getWeb3ErrorMsg(err);
    throw new Error(errMsg);
  }
}

async function read<
  abi extends Abi,
  functionName extends ExtractAbiFunctionNames<abi, "pure" | "view">,
  abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>
>(config: {
  abi: abi;
  address: Address;
  functionName: functionName | ExtractAbiFunctionNames<abi, "pure" | "view">;
  args: AbiParametersToPrimitiveTypes<abiFunction["inputs"], "inputs">;
}): Promise<AbiParametersToPrimitiveTypes<abiFunction["outputs"], "outputs">> {
  try {
    const { address, abi, functionName, args } = config;
    const res = (await readContract({
      address,
      abi: abi as any,
      functionName,
      args: args as any,
    })) as AbiParametersToPrimitiveTypes<abiFunction["outputs"], "outputs">;
    return res;
  } catch (err: any) {
    const errMsg = await getWeb3ErrorMsg(err);
    throw new Error(errMsg);
  }
}

export const Web3Functions = {
  writeContract: write,
  readContract: read,
};
