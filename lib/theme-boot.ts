export const THEME_KEY = "vila-tema";

export const THEME_BOOT_SCRIPT = `try{var v=JSON.parse(localStorage.getItem("${THEME_KEY}")||"null");var t=v==="day"||v==="night"?v:(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day");document.documentElement.dataset.theme=t}catch(e){}`;
