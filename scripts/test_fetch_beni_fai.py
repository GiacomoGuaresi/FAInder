"""Test dello script di raccolta dati. Nessuna chiamata di rete: `requests.get` è sostituito."""
import json

import fetch_beni_fai as f


class FakeResponse:
    def __init__(self, data):
        self._data = data

    def raise_for_status(self):
        pass

    def json(self):
        return {"data": self._data}


def luogo(lid, nome="Luogo", lat=45.0, lng=9.0):
    return {"id": lid, "nome": nome, "slug": f"luogo-{lid}", "coord_geo_lat": lat, "coord_geo_long": lng}


def fake_get(pages_by_url):
    """Restituisce le pagine preparate per ogni URL, poi una pagina vuota."""
    def get(url, params, timeout):
        pages = pages_by_url.get(url, [])
        page = params["page"]
        return FakeResponse(pages[page - 1] if page <= len(pages) else [])
    return get


def test_clean_html_removes_tags_and_collapses_whitespace():
    assert f.clean_html("<p>Una  <b>villa</b>\r\n sul lago</p>") == "Una villa sul lago"


def test_clean_html_returns_none_for_empty_content():
    assert f.clean_html(None) is None
    assert f.clean_html("") is None
    assert f.clean_html("<p> </p>") is None


def test_fetch_fai_data_paginates_dedupes_and_skips_missing_coordinates(monkeypatch):
    pages = [
        [
            {"luogo": luogo(1, "Trattoria"), "descrizione_html": "<p>Cucina tipica</p>",
             "categorie": [{"id": 9, "categoria": "Soggiornare e mangiare"}]},
            {"luogo": luogo(1, "Trattoria"), "descrizione_html": "<p>Seconda offerta</p>", "categorie": []},
            {"luogo": luogo(2, lat=None)},
            {"luogo": None},
        ],
        [{"luogo": luogo(3, "Libreria"), "descrizione_html": "", "payoff": "Sconto ai soci", "categorie": []}],
    ]
    monkeypatch.setattr(f.requests, "get", fake_get({f.BASE_URL_FAI: pages}))
    monkeypatch.setattr(f, "sleep", lambda _: None)

    luoghi, totale = f.fetch_fai_data()

    assert totale == 5
    assert list(luoghi) == [1, 3]
    assert luoghi[1] == {
        "id": 1,
        "title": "Trattoria",
        "lat": 45.0,
        "lng": 9.0,
        "url": "https://fondoambiente.it/luoghi/luogo-1",
        "description": "Cucina tipica",
        "categories": [{"id": 9, "name": "Soggiornare e mangiare"}],
    }
    assert luoghi[3]["description"] == "Sconto ai soci"


def test_main_merges_sources_and_prefers_fai_data(monkeypatch, tmp_path):
    pages = {
        f.BASE_URL_BENI: [[{"luogo": luogo(1, "Villa"), "payoff": "Bene"}, {"luogo": luogo(2, "Castello")}]],
        f.BASE_URL_FAI: [[{"luogo": luogo(1, "Villa"), "payoff": "Offerta", "categorie": [{"id": 8, "categoria": "Arte"}]}]],
    }
    out = tmp_path / "data" / "beni-fai.json"
    monkeypatch.setattr(f.requests, "get", fake_get(pages))
    monkeypatch.setattr(f, "sleep", lambda _: None)
    monkeypatch.setattr(f, "OUT_FILE", out)

    f.main()

    by_id = {item["id"]: item for item in json.loads(out.read_text(encoding="utf-8"))}
    assert set(by_id) == {1, 2}
    assert by_id[1]["categories"] == [{"id": 8, "name": "Arte"}]
    assert by_id[2]["categories"] == [{"id": None, "name": "Bene FAI"}]
