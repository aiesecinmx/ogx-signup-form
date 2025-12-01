import { useState } from "preact/hooks";
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
import InputAdornment from "@mui/material/InputAdornment";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import Autocomplete from "@mui/material/Autocomplete";
import CheckIcon from '@mui/icons-material/Check';
import { universities } from "../constants/universities";
import { backgrounds } from "../constants/backgrounds";

// TODO: Maybe rearrange items for larger screens? (Check with Joy)
export default function SignupForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const stepLabelSlotProps: StepLabelProps["slotProps"] = {
    label: { className: "hidden" },
    stepIcon: { className: "*:[.MuiStepIcon-text]:hidden size-4" }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="w-1/2 mb-10">
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel slotProps={stepLabelSlotProps}>Datos Personales</StepLabel>
          </Step>
          <Step>
            <StepLabel slotProps={stepLabelSlotProps}>Cuéntanos sobre ti</StepLabel>
          </Step>
        </Stepper>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full px-6 gap-6">

        {activeStep === 0 && (
          <>
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
                Autorizo que mis datos se procesen de acuerdo con el <a href="#" target="_blank" className="font-bold text-primary">aviso de privacidad</a> de AIESEC&nbsp;México,&nbsp;A.C.
              </Typography>
            </div>

            <Typography variant="h6" className="font-semibold">
              Datos de Contacto
            </Typography>

            <form className="flex flex-col gap-6">
              <TextField
                required
                id="first-name"
                variant="standard"
                label="Nombre(s)"
              />
              <TextField
                required
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
              <Button id="next-button" variant="outlined" className="normal-case mt-6" endIcon={<ArrowRightAltIcon />} onClick={handleNext}>
                Siguiente
              </Button>
            </form>
          </>
        )}

        {activeStep === 1 && (
          <form className="flex flex-col gap-6">

            <div className="flex flex-col border border-text-disabled rounded-md p-6 gap-4">
              <TextField
                required
                label="Correo electrónico"
                id="email"
                type="email"
                autoComplete="off"
                variant="standard"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>,
                  },
                }}
              />

              <TextField
                required
                label="Contraseña"
                type="password"
                name="new-password"
                id="new-password"
                autoComplete="new-password"
                variant="standard"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">
                      <LockOutlineIcon />
                    </InputAdornment>,
                  },
                }}
              />
            </div>

            <TextField
              required
              label="Teléfono"
              id="phone"
              type="tel"
              autoComplete="tel-local"
              variant="standard"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>,
                },
              }}
            />

            <FormControl fullWidth variant="standard">
              <InputLabel id="program-select-label">Programa de Interés</InputLabel>
              <Select
                labelId="program-select-label"
                id="program-select"
                label="Programa de Interés"
              >
                <MenuItem value="oGV">Voluntario Global</MenuItem>
                <MenuItem value="oGTa">Talento Global (Prácticas Profesionales)</MenuItem>
                <MenuItem value="oGTe">Profesor Global</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              disablePortal
              options={universities}
              // @ts-ignore
              renderInput={(params) => <TextField {...params} label="Universidad" variant="standard" placeholder="Selecciona una opción" />}
            />

            <Autocomplete
              disablePortal
              options={backgrounds}
              // @ts-ignore
              renderInput={(params) => <TextField {...params} label="Carrera o Background Profesional" variant="standard" placeholder="Selecciona una opción" />}
            />

            <FormControl fullWidth variant="standard">
              <InputLabel id="study-level-label">Máximo Nivel de Estudios</InputLabel>
              <Select
                labelId="study-level-label"
                id="study-level"
                label="Máximo Nivel de Estudios"
              >
                <MenuItem value="Preparatoria">Preparatoria</MenuItem>
                <MenuItem value="Tecnico">Técnico</MenuItem>
                <MenuItem value="Licenciatura">Licenciatura</MenuItem>
                <MenuItem value="Maestría">Maestría</MenuItem>
                <MenuItem value="Doctorado">Doctorado</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="standard">
              <InputLabel id="english-level-label">Nivel de Inglés</InputLabel>
              <Select
                labelId="english-level-label"
                id="english-level"
                label="Nivel de Inglés"
              >
                <MenuItem value="A">A1 - A2 (Básico)</MenuItem>
                <MenuItem value="B">B1 - B2 (Intermedio)</MenuItem>
                <MenuItem value="C">C1 - C2 (Avanzado)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="standard">
              <InputLabel id="source-label">¿Cómo te enteraste de AIESEC?</InputLabel>
              <Select
                labelId="source-label"
                id="source"
                label="¿Cómo te enteraste de AIESEC?"
              >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="TikTok">TikTok</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                <MenuItem value="YouTube">YouTube</MenuItem>
                <MenuItem value="Amigos o Familiares">Amigos o Familiares</MenuItem>
                <MenuItem value="Evento Fuera de mi Universidad">Evento Fuera de mi Universidad</MenuItem>
                <MenuItem value="Evento en mi Universidad">Evento en mi Universidad</MenuItem>
                <MenuItem value="Youth Skill Up">Youth Skill Up</MenuItem>
                <MenuItem value="Leaders Lab">Leaders Lab</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" className="normal-case self-center" startIcon={<CheckIcon />} loadingPosition="end" onClick={() => setLoading(true)} loading={loading}>
              Enviar
            </Button>

          </form>

        )}
      </div>
    </div >
  );
}
