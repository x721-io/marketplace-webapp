import { Label } from "flowbite-react";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import { useContext, useEffect, useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { sleep } from "@/utils";
import { useForm } from "react-hook-form";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { toast } from "react-toastify";
import { FormState } from "@/types";
import { formRulesSigupModal } from "@/config/form/rules";
import { AuthenticationContext } from "@/app/auth-provider";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import MyCheckbox from "../X721UIKits/Checkbox";

interface Props extends MyModalProps {
  onSignupSuccess?: (accessToken?: string) => void;
}

export default function SignupModal({ onSignupSuccess, show, onClose }: Props) {
  const { credentials } = useContext(AuthenticationContext);
  const { onUpdateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormState.SignUp>();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { bearerToken } = useAuth();

  const onSignup = async (data: FormState.SignUp) => {
    if (!acceptedTerms) return;
    try {
      setIsSigningUp(true);
      await onUpdateProfile({ ...data, acceptedTerms });
      await sleep(500);
      toast.success("Signed up successfully", {
        autoClose: 1000,
        closeButton: true,
      });
      onSignupSuccess?.(credentials?.accessToken);
      if (onClose) {
        onClose();
      }
    } catch (e: any) {
      toast.error(`Error report: ${e.response?.data?.error || e}`);
      console.error("Error signing up:", e);
    } finally {
      setIsSigningUp(false);
    }
  };

  useEffect(() => {
    if (!show) {
      setValue("email", "");
      setValue("username", "");
    }
  }, [show, setValue]);

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body>
        <form onSubmit={handleSubmit(onSignup)}>
          <div className="max-w-[400px] px-[15px] mx-auto flex flex-col gap-4 py-8">
            <Text
              className="font-semibold text-primary text-center"
              variant="heading-md"
            >
              Sign-up to U2 NFT!
            </Text>
            <Text className="text-secondary text-center" variant="body-18">
              Choose a display name and enter your email address to receive
              updates when your NFTs sell or receive offers.
            </Text>

            <div className="flex flex-col gap-5">
              <Input
                error={!!errors.username}
                placeholder="Display name"
                register={register("username", formRulesSigupModal.username)}
              />
              <Input
                error={!!errors.email}
                placeholder="Enter your email"
                register={register("email", formRulesSigupModal.email)}
              />

              <div className="flex gap-5 items-center">
                <MyCheckbox
                  id="accept"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                />
                <Label
                  htmlFor="accept"
                  className="text-body-16 text-tertiary cursor-pointer"
                >
                  I have read and accept the{" "}
                  <a href="#" className="text-primary">
                    Terms of Service
                  </a>
                  , the{" "}
                  <a href="#" className="text-primary">
                    Term of Creator
                  </a>{" "}
                  and confirm that I am at least 13 years old
                </Label>
              </div>

              <FormValidationMessages errors={errors} />
            </div>

            <div className="flex flex-col gap-5">
              <Button
                type="submit"
                loading={isSigningUp}
                loadingText="Signing up"
                disabled={!acceptedTerms}
              >
                Finish sign-up
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </MyModal.Body>
    </MyModal.Root>
  );
}
