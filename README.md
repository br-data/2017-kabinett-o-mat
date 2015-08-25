# Bayrische Nationalmannschaft

Die App erlaubt es eine eigene Mannschaft aus bayrischen Erst- und Zweitligaspielern aufzustellen. Die Aufstellung wir als Location Hash (#ajad-akauabzz-acafaeaa-bb) gespeichert und kann über die sozialen Netzwerke geteilt werden.

### Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Optimiertes Projekt bauen `grunt dist`

Der Quellcode befindet sich im Verzeichnis `/app`, der optimierte Build findet sich in `dist`.

### Entwickeln
1. Gegebenenfalls SASS installieren `sudo gem install sass`
2. SASS-Compiler starten `grunt watch` oder `sass --watch app/scss:app/css`

### Datenmodel
Die Anwendungsdaten sind in einem JSON-Dictionary gespeichert. Die ID sind zweistellige Strings (aa bis zz). 

```json
{
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
	}
}
```