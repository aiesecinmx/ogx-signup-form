
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepLabel, { type StepLabelProps } from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function SignupForm() {
  const stepLabelSlotProps: StepLabelProps["slotProps"] = {
    label: { className: "hidden" },
    stepIcon: { className: "*:[.MuiStepIcon-text]:hidden size-4" }
  }

  return (
    <div className="flex flex-col items-center max-w-md">{/* TODO: Make this responsive */}
      <div className="w-1/2 mb-10">
        <Stepper activeStep={0}>
          <Step>
            <StepLabel slotProps={stepLabelSlotProps}>Datos de contacto</StepLabel>
          </Step>
          <Step>
            <StepLabel slotProps={stepLabelSlotProps}>Cuéntanos sobre ti</StepLabel>
          </Step>
        </Stepper>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full px-6 gap-6">

        <section className="flex flex-col gap-4">
          <Typography variant="subtitle1" component="h2" className="text-2xl font-bold">
            ¡Deja tus datos e inicia la mejor experiencia de tu vida!
          </Typography>
          <Typography color="textSecondary" className="font-[Montserrat_Variable] font-light text-base">
            Llenar los campos solo te tomará unos minutos y alguien del equipo de AIESEC te contactará en un plazo de 24 horas.
          </Typography>
        </section>

        <div className="flex p-2 pr-5 bg-primary/10 rounded-md items-center">
          <Checkbox />
          <Typography variant="caption" color="textSecondary" className="font-[Montserrat_Variable] tracking-tight">
            Autorizo que mis datos se procesen de acuerdo con el <a href="#" target="_blank" className="font-bold text-primary">aviso de privacidad</a> de AIESEC México, A.C.
          </Typography>
        </div>

        <Typography variant="h6" className="font-semibold">
          Datos de Contacto
        </Typography>

        <form className="flex flex-col gap-6">
          <TextField
            id="first-name"
            variant="standard"
            label="Nombre(s)"
          />
          <TextField
            id="last-name"
            variant="standard"
            label="Apellidos"
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel>Edad</InputLabel>
            <Select
              label="Edad"
            >
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={21}>21</MenuItem>
              <MenuItem value={22}>22</MenuItem>
              <MenuItem value={23}>23</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={26}>26</MenuItem>
              <MenuItem value={27}>27</MenuItem>
              <MenuItem value={28}>28</MenuItem>
              <MenuItem value={29}>29</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" className="normal-case mt-6" endIcon={<ArrowRightAltIcon />}>
            Siguiente
          </Button>
        </form>
      </div>
    </div >
  );
}
