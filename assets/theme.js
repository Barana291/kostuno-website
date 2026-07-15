(function () {
  'use strict';

  var storageKey = 'kostuno-theme';
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  var storedTheme = readStoredTheme();
  var hasManualTheme = storedTheme !== null;
  var checkbox = document.querySelector('.theme-switch-input');
  var choices = document.querySelectorAll('[data-theme-choice]');
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function preferredTheme() {
    return systemTheme.matches ? 'dark' : 'light';
  }

  function writeStoredTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      // The selected theme still applies for this page when storage is blocked.
    }
  }

  function syncWordmark(theme) {
    var wordmark = document.querySelector('.brand-wordmark');
    if (!wordmark) return;

    wordmark.src = theme === 'dark'
      ? '/assets/kostuno-header-wordmark-dark.png?v=20260715-1'
      : '/assets/kostuno-header-wordmark.png?v=20260715-1';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (checkbox) checkbox.checked = theme === 'dark';
    choices.forEach(function (choice) {
      var active = choice.dataset.themeChoice === theme;
      choice.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (themeColor) themeColor.content = theme === 'dark' ? '#0F1115' : '#FFFFFF';
    syncWordmark(theme);
  }

  function selectTheme(theme) {
    hasManualTheme = true;
    writeStoredTheme(theme);
    applyTheme(theme);
  }

  choices.forEach(function (choice) {
    choice.addEventListener('click', function () {
      selectTheme(choice.dataset.themeChoice);
    });
  });

  if (checkbox) {
    checkbox.addEventListener('change', function () {
      selectTheme(checkbox.checked ? 'dark' : 'light');
    });
    checkbox.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        selectTheme(checkbox.checked ? 'light' : 'dark');
      }
    });
  }

  function handleSystemThemeChange() {
    if (!hasManualTheme) applyTheme(preferredTheme());
  }

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', handleSystemThemeChange);
  } else if (systemTheme.addListener) {
    systemTheme.addListener(handleSystemThemeChange);
  }

  applyTheme(storedTheme || preferredTheme());
}());
