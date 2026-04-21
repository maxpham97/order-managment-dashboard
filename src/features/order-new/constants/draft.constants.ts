export const DRAFT_STORAGE_KEY = "tms_draft_workspace";
export const MAX_DRAFT_TABS = 5;
export const MIN_STOPS = 2;
export const MAX_STOPS = 5;

export const EQUIPMENT_OPTIONS = [
    { value: "dry_van",   label: "Dry Van" },
    { value: "reefer",    label: "Reefer" },
    { value: "flatbed",   label: "Flatbed" },
    { value: "step_deck", label: "Step Deck" },
] as const;

export const LOAD_TYPE_OPTIONS = [
    { value: "ftl", label: "FTL" },
    { value: "ltl", label: "LTL" },
] as const;

export const STOP_TYPE_OPTIONS = [
    { value: "pick_up",  label: "Pick Up" },
    { value: "drop_off", label: "Drop Off" },
    { value: "stop",     label: "Stop" },
] as const;

export const APPT_TYPE_OPTIONS = [
    { value: "fixed",  label: "Fixed" },
    { value: "window", label: "Window" },
    { value: "fcfs",   label: "FCFS" },
] as const;
