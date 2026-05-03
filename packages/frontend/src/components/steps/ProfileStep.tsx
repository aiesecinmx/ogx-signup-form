import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckIcon from "@mui/icons-material/Check";
import { universities } from "../../constants/universities";
import { backgrounds } from "../../constants/backgrounds";
import { useSignupStore } from "../../store/signupStore";

export default function ProfileStep() {
  const university = useSignupStore((s) => s.university);
  const career = useSignupStore((s) => s.career);
  const studyLevel = useSignupStore((s) => s.studyLevel);
  const englishLevel = useSignupStore((s) => s.englishLevel);
  const referralSource = useSignupStore((s) => s.referralSource);
  const errors = useSignupStore((s) => s.errors);
  const loading = useSignupStore((s) => s.loading);
  const setUniversity = useSignupStore((s) => s.setUniversity);
  const setCareer = useSignupStore((s) => s.setCareer);
  const setStudyLevel = useSignupStore((s) => s.setStudyLevel);
  const setEnglishLevel = useSignupStore((s) => s.setEnglishLevel);
  const setReferralSource = useSignupStore((s) => s.setReferralSource);
  const setLoading = useSignupStore((s) => s.setLoading);
  const submitForm = useSignupStore((s) => s.submitForm);
  const handleBlur = useSignupStore((s) => s.handleBlur);

  const handleSubmit = () => {
    setLoading(true);
    submitForm();
  };

  return (
    <form className="flex flex-col gap-6">
      <Autocomplete
        disablePortal
        options={universities}
        value={university}
        onChange={(_event, value: string | null) => setUniversity(value)}
        onBlur={() => handleBlur(1)}
        // @ts-ignore
        renderInput={(params) => <TextField {...params} label="Universidad" variant="standard" placeholder="Selecciona una opción" error={!!errors.university} helperText={errors.university} />}
      />

      <Autocomplete
        disablePortal
        options={backgrounds}
        value={career}
        onChange={(_event, value: string | null) => setCareer(value)}
        onBlur={() => handleBlur(1)}
        // @ts-ignore
        renderInput={(params) => <TextField {...params} label="Carrera o Background Profesional" variant="standard" placeholder="Selecciona una opción" error={!!errors.career} helperText={errors.career} />}
      />

      <FormControl fullWidth variant="standard" error={!!errors.studyLevel}>
        <InputLabel id="study-level-label">Máximo Nivel de Estudios</InputLabel>
        <Select
          labelId="study-level-label"
          id="study-level"
          label="Máximo Nivel de Estudios"
          value={studyLevel}
          onChange={(e) => setStudyLevel((e.target as HTMLSelectElement).value)}
          onBlur={() => handleBlur(1)}
        >
          <MenuItem value="Preparatoria">Preparatoria</MenuItem>
          <MenuItem value="Tecnico">Técnico</MenuItem>
          <MenuItem value="Licenciatura">Licenciatura</MenuItem>
          <MenuItem value="Maestría">Maestría</MenuItem>
          <MenuItem value="Doctorado">Doctorado</MenuItem>
        </Select>
        <FormHelperText>{errors.studyLevel}</FormHelperText>
      </FormControl>

      <FormControl fullWidth variant="standard" error={!!errors.englishLevel}>
        <InputLabel id="english-level-label">Nivel de Inglés</InputLabel>
        <Select
          labelId="english-level-label"
          id="english-level"
          label="Nivel de Inglés"
          value={englishLevel}
          onChange={(e) => setEnglishLevel((e.target as HTMLSelectElement).value)}
          onBlur={() => handleBlur(1)}
        >
          <MenuItem value="A">A1 - A2 (Básico)</MenuItem>
          <MenuItem value="B">B1 - B2 (Intermedio)</MenuItem>
          <MenuItem value="C">C1 - C2 (Avanzado)</MenuItem>
        </Select>
        <FormHelperText>{errors.englishLevel}</FormHelperText>
      </FormControl>

      <FormControl fullWidth variant="standard" error={!!errors.referralSource}>
        <InputLabel id="source-label">¿Cómo te enteraste de AIESEC?</InputLabel>
        <Select
          labelId="source-label"
          id="source"
          label="¿Cómo te enteraste de AIESEC?"
          value={referralSource}
          onChange={(e) => setReferralSource((e.target as HTMLSelectElement).value)}
          onBlur={() => handleBlur(1)}
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
        <FormHelperText>{errors.referralSource}</FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        className="normal-case self-center"
        startIcon={<CheckIcon />}
        loadingPosition="end"
        onClick={handleSubmit}
        loading={loading}
      >
        Enviar
      </Button>
    </form>
  );
}
