import fs from 'fs';
import fetch from 'node-fetch';

const BASE_URL = 'https://platform.fondoambiente.it/api/luoghi';
const LIMIT = 300;
const MAX_PAGES = 5; // ← per ora 5, poi useremo last_page

async function fetchPage(page) {
  const url = `${BASE_URL}?limit=${LIMIT}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Errore page ${page}`);
  return res.json();
}

async function run() {
  let all = [];
  let page = 1;
  let lastPage = MAX_PAGES;

  while (page <= lastPage) {
    console.log(`Fetching page ${page}`);
    const json = await fetchPage(page);

    if (page === 1) {
      lastPage = Math.min(json.last_page, MAX_PAGES);
      console.log(`Last page (limited): ${lastPage}`);
    }

    const beni = json.data.map(b => ({
      id: b.id,
      nome: b.nome,
      lat: b.latitudine,
      lng: b.longitudine,
      url: `https://fondoambiente.it/luoghi/${b.slug}`,
      regione: b.regione,
      tipologia: b.tipologia,
    }));

    all.push(...beni);
    page++;
  }

  const output = {
    version: new Date().toISOString().slice(0, 7), // YYYY-MM
    total: all.length,
    beni: all,
  };

  fs.writeFileSync('data/beni.json', JSON.stringify(output, null, 2));
  console.log(`Salvati ${all.length} beni`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
