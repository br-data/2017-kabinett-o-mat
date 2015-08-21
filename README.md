# Bayrische Nationalmannschaft

Die App erlaubt es eine eigene Mannschaft aus bayrischen Erst- und Zweitligaspielern aufzustellen. Die Aufstellung wir als Location Hash (#ajad-akauabzz-acafaeaa-bb) gespeichert und kann über die sozialen Netzwerke geteilt werden.

### Verwendung
1. Repository klonen `git clone https://...`
2. Abhängigkeiten installieren `npm install`
4. SASS-Compiler starten `compass watch`
5. Entwickeln und Änderungen einchecken
6. Optimiertes Projekt bauen `grunt build`

Der Quellcode befindet sich im Verzeichnis `/app`, der optimierte Build findet sich in `dist`.

### Datenmodel
Die Anwendungsdaten sind in einem JSON-Dictionary gespeichert. Die ID sind zweistellige Strings (aa bis zz). 

```json
"ab": {
    "team_short": "FCB",
    "team": "FC Bayern München",
    "name": "Mario Götze",
    "rnr": 19,
    "pos_id": "03-mit",
    "pos": "Mittelfeld",
    "geb_tag": "03.06.1992",
    "geb_ort": "Memmingen",
    "reg_bezirk": "Schwaben"
},

```
