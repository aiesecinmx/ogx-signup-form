import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSignupStore, PROGRAM_TO_EXPA } from "../store/signupStore";

export default function SuccessModal() {
  const registrationComplete = useSignupStore((s) => s.registrationComplete);
  const resetForm = useSignupStore((s) => s.resetForm);
  const program = useSignupStore((s) => s.program);

  const today = new Date().toISOString().split("T")[0];
  const expaCode = PROGRAM_TO_EXPA[program] ?? "";
  const portalUrl = `https://aiesec.org/search?earliest_start_date=${today}&programmes=${expaCode}`;

  return (
    <Dialog open={registrationComplete} disableEscapeKeyDown>
      <DialogTitle component="div" className="text-xl">¡Tu registro está completo!</DialogTitle>
      <DialogContent>
        <Typography>
          Te contactaremos en las próximas 48 horas,
          pero ya puedes iniciar sesión y buscar oportunidades en nuestro portal global.
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={resetForm}>Cerrar</Button>
        <Button href={portalUrl} target="_blank" rel="noopener noreferrer" variant="contained">
          Buscar oportunidades
        </Button>
      </DialogActions>
    </Dialog>
  );
}
