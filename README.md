# Bayerische Nationalmannschaft
Die App erlaubt es eine eigene Mannschaft aus bayerischen Erst- und Zweitligaspielern aufzustellen. Die Aufstellung wir als Location Hash (#ajad-akauabzz-acafaeaa-bb) gespeichert und kann über die sozialen Netzwerke geteilt werden.

**Live:** http://web.br.de/woher-stammt-die-liga/mannschaft

### Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Erforderliche Bibliotheken installieren `bower install`
4. Optimiertes Projekt bauen `grunt dist`

Der Quellcode befindet sich im Verzeichnis `src/`, der optimierte Build findet sich in `dist/`.

### Entwickeln
1. Gegebenenfalls SASS installieren `sudo gem install sass`
2. SASS-Compiler starten `grunt watch` oder `sass --watch src/scss:src/css`

### Tracking
Alle Benutzeraufstellungen werden in ein [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1Flk6E-hy1aHmIno3nkp9n8f2eFBYu4E4Q1tRKCNBheI/) gespeichert. Die Anbindung erfolgt dabei über ein [Skript](https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/) im Google Spreadsheet, welches die Requests entgegen nimmt. Der Request selbst ist ein einfacher POST-Request:

```javascript
request.open('POST','https://script.google.com/macros/s/AKfycbzvz2UDsyp6Iy7YMMVbbnUSKwfCsmrabnVBPlGscrz1STIfGEgE/exec', true);
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send('adaj-abatasav-axaiacbg-ag');
```
### Datenauswertung
Die Anwendung enthält ein Webanwendung, um die gespeicherten Benutzeraufstellungen auszuwerten. Die Anwendung befindet sich im Ordner `analysis/`. Das Tool verwendet eine Kopie der aktuellen Spielerdaten `players.json`. Damit die Auswertung klappt, muss diese Datei aktuell sein. Fernen benötigt die Anwendung diverse JavaScript-Bibliotheken, welche über Bower installiert werden müssen. 

### Datenmodel
Die Anwendungsdaten sind in einem JSON-Dictionary `players.json` gespeichert. Die ID sind zweistellige Strings (aa bis zz). 

```json
{
    "ab": {
    	"id": "ab",
        "name": "Mario Götze",
        "team": "FC Bayern München",
        "team_short": "FCB",
        "pos": "Mittelfeld",
        "rnr": 19,
        "geb_tag": "03.06.1992",
        "geb_ort": "Memmingen",
        "reg_bezirk": "Schwaben"
    }
}
```

### Bekannte Probleme
- Drag and Drop unter IE9 funktioniert nicht
- Scrollen auf Geräten mit kleinen Viewport ist schwierig
- Tracking-Requests können mehr als einmal abgesendet werden
