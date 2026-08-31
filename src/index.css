@import "tailwindcss";

@layer base {
  :root {
    --color-bg: #0b0d11;
    --color-surface: #14171f;
    --color-text-primary: #f3f4f6;
    --color-text-secondary: #9ca3af;
    --color-primary: #3b82f6;
    --color-secondary: #6366f1;
    --color-accent: #f59e0b;
    --color-border: #232733;
    --color-focus: #60a5fa;
    --color-error: #ef4444;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --font-title: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    --font-body: 'Inter', system-ui, -apple-system, sans-serif;
    --font-base-size: 16px;
    --radius-main: 12px;
    --radius-sm: 6px;
    --border-width: 1px;
    --shadow-level: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
    --max-container-width: 1200px;
    --motion-duration: 0.25s;
  }

  html {
    font-family: var(--font-body);
    font-size: var(--font-base-size);
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  body {
    min-height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    line-height: 1.6;
  }

  /* Accessible Focus Ring */
  *:focus-visible {
    outline: 2px solid var(--color-focus) !important;
    outline-offset: 2px !important;
  }

  /* Custom Typography Classes */
  .font-title {
    font-family: var(--font-title);
  }

  .font-body {
    font-family: var(--font-body);
  }
}


/* Admin-controlled visual autonomy */
:root {
  --grid-columns: 3;
  --card-gap: 1.5rem;
  --section-gap: 4rem;
  --card-aspect-ratio: 16 / 10;
  --title-weight: 700;
  --body-line-height: 1.6;
  --heading-letter-spacing: -0.02em;
  --card-hover-distance: -4px;
  --card-hover-scale: 1;
  --image-hover-scale: 1.02;
  --button-hover-distance: -4px;
  --button-press-scale: 1;
  --motion-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

.font-title {
  font-weight: var(--title-weight);
  letter-spacing: var(--heading-letter-spacing);
}

body {
  line-height: var(--body-line-height);
}

.admin-controlled-grid {
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  gap: var(--card-gap);
}

.admin-controlled-card {
  transition:
    transform var(--motion-duration) var(--motion-easing),
    box-shadow var(--motion-duration) var(--motion-easing),
    border-color var(--motion-duration) var(--motion-easing);
}
.admin-controlled-card:hover {
  transform: translateY(var(--card-hover-distance)) scale(var(--card-hover-scale));
}
.admin-controlled-image {
  aspect-ratio: var(--card-aspect-ratio);
}
.admin-controlled-image img {
  transition: transform var(--motion-duration) var(--motion-easing);
}
.admin-controlled-image:hover img {
  transform: scale(var(--image-hover-scale));
}
.admin-controlled-button {
  transition: transform var(--motion-duration) var(--motion-easing), background-color var(--motion-duration) var(--motion-easing), border-color var(--motion-duration) var(--motion-easing);
}
.admin-controlled-button:hover {
  transform: translateY(var(--button-hover-distance));
}
.admin-controlled-button:active {
  transform: scale(var(--button-press-scale));
}

@keyframes adminPortfolioEntrance {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
[data-entrance="fade"] .admin-controlled-card {
  animation: adminPortfolioEntrance var(--motion-duration) var(--motion-easing) both;
}
[data-entrance="slide"] .admin-controlled-card {
  animation: adminPortfolioEntrance calc(var(--motion-duration) * 1.4) var(--motion-easing) both;
}

@media (max-width: 767px) {
  .admin-controlled-grid {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-reduced-motion="true"] *,
  [data-reduced-motion="true"] *::before,
  [data-reduced-motion="true"] *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

[data-card-hover="glow"] .admin-controlled-card:hover {
  box-shadow: 0 0 0 1px var(--color-primary), 0 14px 40px rgba(0,0,0,.22);
}
[data-image-hover="pan"] .admin-controlled-image:hover img {
  transform: scale(1.02) translateX(4px);
}
