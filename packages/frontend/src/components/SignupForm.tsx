import { useEffect } from "preact/hooks";
import Step from "@mui/material/Step";
import StepLabel, { type StepLabelProps } from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { useSignupStore } from "../store/signupStore";
import PersonalDataStep from "./steps/PersonalDataStep";
import ProfileStep from "./steps/ProfileStep";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import DuplicateEmailModal from "./DuplicateEmailModal";
import PendingModal from "./PendingModal";

const sectionOneName = "Datos personales";
const sectionTwoName = "Acerca de ti";

const stepLabelSlotProps: StepLabelProps["slotProps"] = {
  label: { className: "hidden" },
  stepIcon: { className: "*:[.MuiStepIcon-text]:hidden size-4" },
};

// TODO: Maybe rearrange items for larger screens? (Check with Joy)
export default function SignupForm() {
  const activeStep = useSignupStore((s) => s.activeStep);
  const goBack = useSignupStore((s) => s.goBack);
  const fetchMcAlignments = useSignupStore((s) => s.fetchMcAlignments);

  useEffect(() => {
    fetchMcAlignments();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="flex mb-10 w-full items-center justify-center px-4">
        <div className="mr-auto">
          <IconButton aria-label="Regresar" disabled={activeStep === 0} onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div className="basis-1/2">
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel slotProps={stepLabelSlotProps}>{sectionOneName}</StepLabel>
            </Step>
            <Step>
              <StepLabel slotProps={stepLabelSlotProps}>{sectionTwoName}</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div className="invisible ml-auto">
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full px-6 gap-6">
        {activeStep === 0 && <PersonalDataStep />}
        {activeStep === 1 && <ProfileStep />}
      </div>

      <SuccessModal />
      <ErrorModal />
      <DuplicateEmailModal />
      <PendingModal />
    </div>
  );
}
