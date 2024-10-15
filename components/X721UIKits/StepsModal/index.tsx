"use client";

import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import { ClipLoader } from "react-spinners";
import { MyModal } from "../Modal";
import Button from "@/components/Button";

type Step = {
  title: string;
  description: string;
  state?: "loading" | "completed" | "error";
};

type StepsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  steps: Step[];
  erorStep?: {
    stepIndex: number;
    reason: string;
  } | null;
  title?: string;
  onRetry?: () => void;
};

const StepsModal: React.FC<StepsModalProps> = ({
  currentStep,
  title = "",
  isOpen,
  onClose,
  steps,
  erorStep = null,
  onRetry = null,
}) => {
  const getStepState = (
    stepIndex: number
  ): {
    state: "completed" | "loading" | "queue" | "error";
    renderedComp: React.ReactNode | null;
  } => {
    if (stepIndex === erorStep?.stepIndex) {
      return {
        state: "error",
        renderedComp: (
          <div className="h-[40px] aspect-square rounded-full bg-[#2e2e2e] flex items-center justify-center">
            <ErrorIcon
              htmlColor="#ffffff"
              style={{
                fontSize: "40px",
              }}
            />
          </div>
        ),
      };
    }
    if (stepIndex < currentStep) {
      return {
        state: "completed",
        renderedComp: (
          <div className="h-[40px] aspect-square rounded-full bg-[#2e2e2e] flex items-center justify-center">
            <CheckIcon htmlColor="#ffffff" />
          </div>
        ),
      };
    } else if (stepIndex === currentStep) {
      return {
        state: "loading",
        renderedComp: (
          <div className="h-[40px] aspect-square rounded-full bg-[#2e2e2e] flex items-center justify-center">
            <ClipLoader size={20} color="#ffffff" />
          </div>
        ),
      };
    } else {
      return {
        state: "queue",
        renderedComp: (
          <div className="h-[40px] aspect-square rounded-full border-solid border-[1px] border-[#333333] flex items-center justify-center"></div>
        ),
      };
    }
  };

  return (
    <MyModal.Root
      onClose={onClose}
      show={isOpen}
      className="flex items-center justify-center text-[white]"
      bodyContainerStyle={{
        background: "#252525",
        width: "500px",
      }}
    >
      <MyModal.Header>
        <h1 className="text-[white] font-bold">{title}</h1>
      </MyModal.Header>
      <MyModal.Body className="bg-[#252525] pb-3">
        <div className="w-full flex flex-col bg-[#252525] text-[white]">
          {steps.map((step, i) => (
            <div className="w-full flex items-center gap-5" key={i}>
              <div className="w-[45px] h-[100px] flex flex-col items-center justify-center">
                <div
                  className="w-[1px] h-[30px]"
                  style={{
                    background: i === 0 ? "transparent" : "#3d3d3d",
                  }}
                ></div>
                {getStepState(i).renderedComp}
                <div
                  style={{
                    background:
                      i === steps.length - 1 ? "transparent" : "#3d3d3d",
                  }}
                  className="w-[1px] h-[30px]"
                ></div>
              </div>
              <div className="flex-1 flex flex-col gap-0">
                <div className="font-bold text-[white] text-[1.1rem]">
                  {step.title}
                </div>
                {getStepState(i).state === "error" && (
                  <div className="font-medium text-[#EF5350] text-[1rem] mt-1">
                    {erorStep?.reason}
                  </div>
                )}
                {getStepState(i).state === "error" && (
                  <div className="font-medium text-[1rem]">
                    <button
                    className="h-[35px] bg-[#000] px-8 rounded-md mt-2"
                      onClick={() => {
                        onRetry && onRetry();
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
};

export default StepsModal;
