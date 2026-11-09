export type SwarmApi = {
  play: (options: {
    mode: string;
    vibe: string;
    random: boolean;
    origin: string;
    order: string;
    cursors: number;
    choreography: boolean;
    fixedCursors: boolean;
    readableTyping: boolean;
    entrance: string;
    exit: string;
    speed: number;
    ui: boolean;
    root: HTMLElement;
    logo: string;
  }) => Promise<void>;
  skip: () => void;
  running: boolean;
  activeRoot: HTMLElement | null;
  lastPlan: {
    start: string;
    order: string;
    strikes: string;
    entrance: string;
    exit: string;
    speed: number;
  } | null;
};
declare global {
  interface Window {
    SwarmIntro?: SwarmApi;
  }
}
