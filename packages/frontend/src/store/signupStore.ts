import { create } from "zustand";
import * as z from "zod/mini";
import { step0Schema, step1Schema } from "@ogx/shared";

const API_URL = import.meta.env.VITE_MX_SIGNUP_URL as string;
const MC_ALIGNMENTS_URL = import.meta.env.VITE_MX_ALIGNMENTS_URL as string;

export const PROGRAM_TO_EXPA: Record<string, number> = { GV: 7, GTa: 8, GTe: 9 };

export interface Alignment {
  id: number; // Id of the LC (EY) responsible for this alignment
  value: string; // Readable version of the alignment. Important: It expects the following format: State - Alignment Name
  alignment_id: number;
}

export interface McWithAlignments {
  id: number; // Country id
  name: string;
  alignments: Alignment[];
}

interface SignupState {
  mcInfo: McWithAlignments | null;
  loadingAlignments: boolean;
  fetchMcAlignments: () => Promise<void>;

  // Step 0 fields
  consent: boolean;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;

  // Step 1 fields
  phone: string;
  university: Alignment | null;
  major: string | null;
  schoolingLevel: string;
  englishProficiency: string;
  referralSource: string;
  program: 'GV' | 'GTa' | 'GTe' | '';

  // Navigation
  activeStep: number;
  loading: boolean;
  registrationComplete: boolean;
  registrationError: string | null;
  duplicateEmail: boolean;

  // Validation
  errors: Record<string, string>;

  // Actions
  setConsent: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setAge: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPhone: (value: string) => void;
  setUniversity: (value: Alignment | null) => void;
  setMajor: (value: string | null) => void;
  setSchoolingLevel: (value: string) => void;
  setEnglishProficiency: (value: string) => void;
  setReferralSource: (value: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  clearRegistrationError: () => void;
  clearDuplicateEmail: () => void;
  goNext: () => void;
  goBack: () => void;
  setLoading: (value: boolean) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  handleBlur: (step: 0 | 1) => void;
}

function buildErrors(error: Parameters<typeof z.flattenError>[0]): Record<string, string> {
  const flat = z.flattenError(error);
  return Object.fromEntries(
    Object.entries(flat.fieldErrors).map(([k, v]) => [k, (v as string[])?.[0] ?? ''])
  );
}

function getStep0Payload(state: SignupState) {
  return {
    consent: state.consent,
    firstName: state.firstName,
    lastName: state.lastName,
    age: state.age,
    phone: state.phone,
    email: state.email,
    password: state.password,
  };
}

function getStep1Payload(state: SignupState) {
  return {
    university: state.university,
    major: state.major ?? '',
    schoolingLevel: state.schoolingLevel,
    englishProficiency: state.englishProficiency,
    referralSource: state.referralSource,
  };
}

export const useSignupStore = create<SignupState>((set, get) => ({
  mcInfo: null,
  loadingAlignments: false,
  fetchMcAlignments: async () => {
    const prepareAlignments = (mc: McWithAlignments) => {
      mc.alignments.sort((a, b) => a.value.localeCompare(b.value, "es-MX"))
      mc.alignments = mc.alignments.filter((a, i, alignments) => {
        return a.value !== alignments[i + 1]?.value
      })
      mc.alignments.sort((a, b) => a.value.split(' - ')[0].localeCompare(b.value.split(' - ')[0], "es-MX"))
    }

    const injected: McWithAlignments[] | undefined = (window as any).AIESEC_MC_ALIGNMENTS;
    if (Array.isArray(injected) && injected.length) {
      prepareAlignments(injected[0]);
      set({ mcInfo: injected[0] });
      return;
    }
    try {
      console.log('Fetching MC Alignments...')
      set({ loadingAlignments: true })
      const res = await fetch(MC_ALIGNMENTS_URL);
      const [data]: McWithAlignments[] = await res.json();
      prepareAlignments(data)

      console.log('AIESEC MC Alignments (Mexico):', data);
      // TODO: Add Zod validation for retrieved payload and error management instead of blindly trusting structure
      set({ mcInfo: data, loadingAlignments: false });
    } catch (e) {
      console.error('Failed to fetch MC alignments:', e);
      set({ mcInfo: null, loadingAlignments: false });
    }
  },

  // Step 0 fields
  consent: false,
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  password: "",

  // Step 1 fields
  phone: "",
  university: null,
  major: null,
  schoolingLevel: "",
  englishProficiency: "",
  referralSource: "",
  program: ((window as any).AIESEC_PROGRAM ?? '') as 'GV' | 'GTa' | 'GTe' | '',

  // Navigation
  activeStep: 0,
  loading: false,
  registrationComplete: false,
  registrationError: null,
  duplicateEmail: false,

  // Validation
  errors: {},

  // Actions
  setConsent: (value) => set({ consent: value }),
  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setAge: (value) => set({ age: value }),
  setEmail: (value) => set({ email: value }),
  setPassword: (value) => set({ password: value }),
  setPhone: (value) => set({ phone: value }),
  setUniversity: (value) => set({ university: value }),
  setMajor: (value) => set({ major: value }),
  setSchoolingLevel: (value) => set({ schoolingLevel: value }),
  setEnglishProficiency: (value) => set({ englishProficiency: value }),
  setReferralSource: (value) => set({ referralSource: value }),
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),
  clearRegistrationError: () => set({ registrationError: null }),
  clearDuplicateEmail: () => set({ duplicateEmail: false }),
  goNext: () => {
    const state = get();
    const result = step0Schema.safeParse(getStep0Payload(state));
    if (!result.success) {
      set({ errors: buildErrors(result.error) });
      return;
    }
    set({ errors: {}, activeStep: state.activeStep + 1 });
  },
  goBack: () => set((state) => ({ activeStep: state.activeStep - 1, errors: {} })),
  setLoading: (value) => set({ loading: value }),
  resetForm: () => set({
    consent: false,
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    university: null,
    major: null,
    schoolingLevel: "",
    englishProficiency: "",
    referralSource: "",
    activeStep: 0,
    errors: {},
    loading: false,
    registrationComplete: false,
    registrationError: null,
    duplicateEmail: false,
  }),
  submitForm: async () => {
    const state = get();
    const result = step1Schema.safeParse(getStep1Payload(state));
    if (!result.success) {
      set({ loading: false, errors: buildErrors(result.error) });
      return;
    }

    set({ loading: true, errors: {} });
    const payload = {
      ...getStep0Payload(state),
      ...getStep1Payload(state),
      program: state.program,
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        set({ loading: false, registrationComplete: true });
        return;
      }

      if (res.status === 422) {
        set({ loading: false, duplicateEmail: true });
        return;
      }

      const data = await res.json().catch(() => ({}));
      set({ loading: false, registrationError: (data as any)?.error ?? `Error ${res.status}` });
    } catch (err) {
      set({ loading: false, registrationError: err instanceof Error ? err.message : 'Error de red' });
    }
  },
  handleBlur: (step) => {
    const state = get();
    if (Object.keys(state.errors).length === 0) return;
    const schema = step === 0 ? step0Schema : step1Schema;
    const payload = step === 0 ? getStep0Payload(state) : getStep1Payload(state);
    const result = schema.safeParse(payload);
    set({ errors: result.success ? {} : buildErrors(result.error) });
  },
}));
