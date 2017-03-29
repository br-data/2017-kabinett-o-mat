# Bayerische Nationalmannschaft
Die App erlaubt es eine eigene Mannschaft aus bayerischen Erst- und Zweitligaspielern aufzustellen. Die Aufstellung wir als Location Hash (#adaj-akavcoab-acaeaaaf-ag) gespeichert und kann so über die sozialen Netzwerke geteilt werden. Die App wurde das Projekt [Heimvorteil – Woher stammt die Liga](http://web.br.de/woher-stammt-die-liga/) entwickelt.

- **BR:** [Wähle deine bayerische Nationalmannschaft](http://web.br.de/interaktiv/heimvorteil-nationalmannschaft/#adaj-akavcoab-acaeaaaf-ag)
- **SWR:** [Wähle Deine Südwest-Elf der Saison](http://www.swr.de/sport/fussball-voting-waehle-deine-suedwest-elf-der-saison/-/id=13831144/did=19555592/nid=13831144/182zxt1/index.html)

### Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Projekt bauen mit `grunt dist`
4. Website über Apache oder einen ähnlichen HTTP-Server ausliefern

Der Quellcode befindet sich im Verzeichnis `src/`, der optimierte Build findet sich in `dist/`.

### Daten
Alle Spielerdaten beruhen auf Vereinsangaben. Die Anwendungsdaten sind in einem JSON-Dictionary `players.json` gespeichert. Die ID ist jeweils eine zweistelliger String (aa bis zz).

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

### Tracking
Alle Benutzeraufstellungen werden in ein [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1Flk6E-hy1aHmIno3nkp9n8f2eFBYu4E4Q1tRKCNBheI/) gespeichert. Die Anbindung erfolgt dabei über ein [Skript](https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/) im Google Spreadsheet, welches die Requests entgegennimmt. Der Request selbst ist ein einfacher POST-Request:

```javascript
request.open('POST','https://script.google.com/macros/s/AKfycbzvz2UDsyp6Iy7YMMVbbnUSKwfCsmrabnVBPlGscrz1STIfGEgE/exec', true);
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send('adaj-abatasav-axaiacbg-ag');
```

### Datenauswertung
Die Anwendung enthält ein Webanwendung, um die gespeicherten Benutzeraufstellungen auszuwerten. Die Anwendung befindet sich im Ordner `analysis/`. Das Tool verwendet eine Kopie der aktuellen Spielerdaten `players.json`. Damit die Auswertung klappt, muss diese Datei aktuell sein. Fernen benötigt die Anwendung diverse JavaScript-Bibliotheken, welche über NPM installiert werden müssen. 

### Entwickeln
Zum Entwickeln und Bauen des Projekts wird [Node.js](https://nodejs.org/en/) und [Ruby](https://www.ruby-lang.org/) benötigt. Um die [Sass](http://sass-lang.com/)-Stylesheets zu kompilieren, braucht man Ruby-Sass und Grunt:

1. Gebenenfalls Grunt-CLI installieren `npm install -g grunt-cli`
2. Gegebenenfalls SASS installieren `sudo gem install sass`
3. SASS-Compiler starten `grunt watch` oder `sass --watch src/scss:src/css`

Zum lokalen Entwickeln ist ein kleiner [HTTP-Server](https://github.com/indexzero/http-server) integriert. Diesen kann man mit dem Befehl `npm start` starten. Der Server läuft unter http://localhost:8080. Beim Starten des Entwicklungsservers sollte automatisch ein neues Browserfenster aufgehen.

### Lizenz
Der Quellcode diese Projekts wurde unter einer MIT-Lizenz veröffentlicht. Nicht in der Lizenz enthalten sind die Spielerbilder und Vereinslogos im Ordner `images/`. Alle Spielerbilder und Vereinslogos sind urheberrechtlich geschützt und dürfen nicht weiterverwendet werden.

### Bekannte Probleme
- Drag and Drop unter IE8 funktioniert nicht
- Scrollen auf Geräten mit kleinen Viewport ist schwierig
- Tracking-Requests können mehr als einmal abgesendet werden
