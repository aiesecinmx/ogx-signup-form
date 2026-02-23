import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InputAdornment from "@mui/material/InputAdornment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import { useSignupStore } from "../../store/signupStore";

export default function PersonalDataStep() {
  const consent = useSignupStore((s) => s.consent);
  const firstName = useSignupStore((s) => s.firstName);
  const lastName = useSignupStore((s) => s.lastName);
  const age = useSignupStore((s) => s.age);
  const email = useSignupStore((s) => s.email);
  const password = useSignupStore((s) => s.password);
  const setConsent = useSignupStore((s) => s.setConsent);
  const setFirstName = useSignupStore((s) => s.setFirstName);
  const setLastName = useSignupStore((s) => s.setLastName);
  const setAge = useSignupStore((s) => s.setAge);
  const setEmail = useSignupStore((s) => s.setEmail);
  const setPassword = useSignupStore((s) => s.setPassword);
  const phone = useSignupStore((s) => s.phone);
  const setPhone = useSignupStore((s) => s.setPhone);
  const goNext = useSignupStore((s) => s.goNext);

  return (
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
        <Checkbox
          checked={consent}
          onChange={(e) => setConsent((e.target as HTMLInputElement).checked)}
        />
        <Typography variant="caption" color="textSecondary" className="font-[Montserrat_Variable] tracking-tight">
          Autorizo que mis datos se procesen de acuerdo con el <a href="#" target="_blank" className="font-bold text-primary">aviso de privacidad</a> de AIESEC&nbsp;México,&nbsp;A.C.
        </Typography>
      </div>

      <section>
        <Typography variant="h6" className="font-semibold">
          Datos personales
        </Typography>
        <Typography color="textSecondary" className="font-[Montserrat_Variable] font-light">
          Crea tu cuenta para nuesto portal de oportunidades
        </Typography>
      </section>

      <form className="flex flex-col gap-6">
        <TextField
          required
          id="first-name"
          variant="standard"
          label="Nombre(s)"
          value={firstName}
          onChange={(e) => setFirstName((e.target as HTMLInputElement).value)}
        />
        <TextField
          required
          id="last-name"
          variant="standard"
          label="Apellidos"
          value={lastName}
          onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
        />
        <FormControl variant="standard" fullWidth>
          <InputLabel>Edad</InputLabel>
          <Select
            label="Edad"
            value={age}
            onChange={(e) => setAge((e.target as HTMLSelectElement).value)}
          >
            <MenuItem value="18">18</MenuItem>
            <MenuItem value="19">19</MenuItem>
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="21">21</MenuItem>
            <MenuItem value="22">22</MenuItem>
            <MenuItem value="23">23</MenuItem>
            <MenuItem value="24">24</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="26">26</MenuItem>
            <MenuItem value="27">27</MenuItem>
            <MenuItem value="28">28</MenuItem>
            <MenuItem value="29">29</MenuItem>
            <MenuItem value="30">30</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required
          label="Teléfono"
          id="phone"
          type="tel"
          autoComplete="tel"
          variant="standard"
          value={phone}
          onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <div className="flex flex-col border border-text-disabled rounded-md p-6 gap-4">
          <TextField
            required
            label="Correo electrónico"
            id="email"
            type="email"
            autoComplete="off"
            variant="standard"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
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
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlineIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <Button
          id="next-button"
          variant="outlined"
          className="normal-case mt-6"
          endIcon={<ArrowRightAltIcon />}
          onClick={goNext}
        >
          Siguiente
        </Button>
      </form>
    </>
  );
}
