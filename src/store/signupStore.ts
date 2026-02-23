import { create } from "zustand";

interface SignupState {
  // Step 0 fields
  consent: boolean;
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;

  // Step 1 fields
  phone: string;
  university: string | null;
  career: string | null;
  studyLevel: string;
  englishLevel: string;
  referralSource: string;

  // Navigation
  activeStep: number;
  loading: boolean;

  // Actions
  setConsent: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setAge: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPhone: (value: string) => void;
  setUniversity: (value: string | null) => void;
  setCareer: (value: string | null) => void;
  setStudyLevel: (value: string) => void;
  setEnglishLevel: (value: string) => void;
  setReferralSource: (value: string) => void;
  goNext: () => void;
  goBack: () => void;
  setLoading: (value: boolean) => void;
  submitForm: () => void;
}

export const useSignupStore = create<SignupState>((set, get) => ({
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
  career: null,
  studyLevel: "",
  englishLevel: "",
  referralSource: "",

  // Navigation
  activeStep: 0,
  loading: false,

  // Actions
  setConsent: (value) => set({ consent: value }),
  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setAge: (value) => set({ age: value }),
  setEmail: (value) => set({ email: value }),
  setPassword: (value) => set({ password: value }),
  setPhone: (value) => set({ phone: value }),
  setUniversity: (value) => set({ university: value }),
  setCareer: (value) => set({ career: value }),
  setStudyLevel: (value) => set({ studyLevel: value }),
  setEnglishLevel: (value) => set({ englishLevel: value }),
  setReferralSource: (value) => set({ referralSource: value }),
  goNext: () => set((state) => ({ activeStep: state.activeStep + 1 })),
  goBack: () => set((state) => ({ activeStep: state.activeStep - 1 })),
  setLoading: (value) => set({ loading: value }),
  submitForm: () => {
    const state = get();
    console.log("Form submitted:", {
      consent: state.consent,
      firstName: state.firstName,
      lastName: state.lastName,
      age: state.age,
      email: state.email,
      password: state.password,
      phone: state.phone,
      university: state.university,
      career: state.career,
      studyLevel: state.studyLevel,
      englishLevel: state.englishLevel,
      referralSource: state.referralSource,
    });
  },
}));
