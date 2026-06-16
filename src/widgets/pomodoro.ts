import type { DashboardWidgetContext, DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

// ── Pomodoro Timer plugin shim ────────────────────────────────────────────
// Targets eatgrass/obsidian-pomodoro-timer (manifest id "pomodoro-timer").
// `plugin.timer` is a public Svelte-store-shaped object (Readable<TimerStore>)
// — `subscribe` follows the standard Svelte store contract (returns an
// unsubscribe function, and calls back immediately with the current value),
// which is the stable part of this integration even if the plugin's
// internals change. `toggleTimer` is a public method used by the plugin's
// own commands, so it's a reasonably safe surface to call into directly.

interface TimerStore {
  running: boolean;
  mode: 'WORK' | 'BREAK';
  remained: { millis: number; human: string };
  finished: boolean;
}

interface PomodoroTimer {
  subscribe(run: (state: TimerStore) => void): () => void;
  toggleTimer(): void;
}

interface PomodoroPlugin {
  timer?: PomodoroTimer;
}

function getPomodoroTimer(ctx: DashboardWidgetContext): PomodoroTimer | null {
  const timer = ctx.getPlugin<PomodoroPlugin>('pomodoro-timer')?.timer;
  if (!timer || typeof timer.subscribe !== 'function' || typeof timer.toggleTimer !== 'function') return null;
  return timer;
}

function render(root: HTMLElement, ctx: DashboardWidgetContext): void {
  const timer = getPomodoroTimer(ctx);
  if (!timer) return; // Pomodoro Timer plugin not installed/enabled — show nothing

  root.createEl('div', { cls: 'qw-dash-section-label', text: 'POMODORO' });
  const card = root.createEl('div', { cls: 'qw-dash-pomodoro-card' });
  const modeEl = card.createEl('div', { cls: 'qw-dash-pomodoro-mode' });
  const timeEl = card.createEl('div', { cls: 'qw-dash-pomodoro-time' });
  const stateEl = card.createEl('div', { cls: 'qw-dash-pomodoro-state' });

  // The Pomodoro Timer plugin's own store already pushes updates reactively
  // (Svelte `subscribe` contract), and a sidebar's `collapse()` is purely
  // visual — it doesn't tear down this view or pause its JS — so the
  // subscription below stays live and accurate the whole time the sidebar
  // is collapsed. No separate redraw loop needed; that would just be this
  // plugin re-implementing timing logic the Pomodoro Timer plugin already owns.
  const unsubscribe = timer.subscribe((state) => {
    card.classList.toggle('qw-dash-pomodoro-card--running', state.running);
    modeEl.setText(state.mode === 'WORK' ? 'Focus' : 'Break');
    modeEl.classList.toggle('qw-dash-pomodoro-mode--break', state.mode === 'BREAK');
    timeEl.setText(state.remained.human);
    stateEl.setText(state.running ? 'Tap to pause' : 'Tap to start');
  });
  ctx.onCleanup(unsubscribe);

  card.addEventListener('click', () => {
    ctx.vibrate(8);
    timer.toggleTimer();
  });
}

export const pomodoroWidget: DashboardWidgetDefinition = {
  id: 'pomodoro',
  label: 'Pomodoro Timer',
  render,
};
