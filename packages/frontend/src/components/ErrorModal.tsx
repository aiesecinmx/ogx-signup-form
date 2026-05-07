import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSignupStore } from "../store/signupStore";

export default function ErrorModal() {
  const registrationError = useSignupStore((s) => s.registrationError);
  const clearRegistrationError = useSignupStore((s) => s.clearRegistrationError);

  return (
    <Dialog open={registrationError !== null} disableEscapeKeyDown>
      <DialogTitle component="div" className="text-xl">Error de registro</DialogTitle>
      <DialogContent>
        <Typography>
          Ocurrió un error en el registro. Si el problema persiste, envíanos un correo a{" "}
          <a href="mailto:contacto@aiesec.org.mx">contacto@aiesec.org.mx</a> para poder ayudarte.
        </Typography>
        {registrationError && (
          <Typography variant="body2" className="mt-3 text-gray-500">
            Detalles: {registrationError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={clearRegistrationError} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
