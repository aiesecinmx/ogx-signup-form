import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSignupStore } from "../store/signupStore";

export default function PendingModal() {
  const expaPending = useSignupStore((s) => s.expaPending);
  const resetForm = useSignupStore((s) => s.resetForm);

  return (
    <Dialog open={expaPending} disableEscapeKeyDown>
      <DialogTitle component="div" className="text-xl">¡Ya tenemos tu registro!</DialogTitle>
      <DialogContent>
        <Typography>
          No pudimos completar tu registro en nuestro portal global, ¡pero ya tenemos tu información!
          Te contactaremos en las próximas 48 horas para ayudarte a continuar tu proceso.
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={resetForm} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
