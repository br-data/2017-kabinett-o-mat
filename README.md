# Kabinett-O-Mat

Die Koalitionsverhandlungen von Union und SPD haben begonnen – und damit auch der Kampf um die Ministerposten. Stellen Sie Ihr persönliches Wunsch-Kabinett auf und teilen Sie es mit Ihren Freunden. Eine interaktive Anwendung zum Aufstellen und Teilen von Kabinetten (oder anderen Arten von „Teams“). 

- **Live (Groko)**: http://web.br.de/interaktiv/kabinett-o-mat-groko/
- **Live (Jamaika)**: http://web.br.de/interaktiv/kabinett-o-mat/

Die jeweils veröffentlichten Versionen liegen auf einem eigenen Release-Branch.

### Verwendung

1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Projekt bauen mit `grunt dist`
4. Website über Apache oder einen ähnlichen HTTP-Server ausliefern

Der Quellcode befindet sich im Verzeichnis `src/`, der optimierte Build findet sich in `dist/`.

### Daten

Die Liste der Politiker ist eine subjektive Auswahl aussichtsreicher oder interessanter Kandidaten. Diese Liste erhebt keinen Anspruch auf Vollständigkeit. Die jeweils verfügbaren Politiker werden in der Datei `data/politicians.json` definiert:

```javascript
{
  "id": "ab",
  "name": "Wolfgang Schäuble",
  "party": "CDU",
  "position": "Bundestagspräsident"
}
```

Die Auswahl der Ministerien bildet den Stand der vergangenen Legislaturperiode ab und kann in der Datei  `data/departments.json` geändert werden:

```javascript
{
  "name": "Bundeskanzleramt",
  "id": "ka",
  "politician": null
}
```

Die Bilder der Politiker und Icons der Ministerien finden sich jeweils im Ordner `images`.

### Tracking

Wenn ein Benutzer auf Teilen klickt, wird eine Benutzer-ID erzeugt, die aktuelle Aufstellung an unsere [Tracking-API](https://github.com/digitalegarage/kabinett-o-mat-api) übermitteln und in einer Datenbank (MongoDB) gespeichert:

```javascript
{ 
  "user" : "750c4efa-b6ee-4b81-b37a-9a46babf22a3",
  "hash" : "ad-bs-ba-ai-bg-aj-ac-bk-aw-bd-ah-bu-bw-bb-bi"
}
```

Der Request selbst ist ein einfacher POST-Request:

```javascript
request.open('POST','http://ddj.br.de/kabinett-o-mat/post', true);
request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
request.send(JSON.stringify(data));
```

Die eindeutige Benutzer-ID wird nur dazu verwendet, um festzustellen welche Aufstellung der Benutzer als letztes geteilt hat und um Duplikate zu vermeiden. 

### Datenauswertung

Um die gespeicherten Benutzer-Kabinette auszuwerten, müssen die Daten zuerst aus der MongoDB exportiert werden:

```
$ mongoexport --jsonArray -d kabinett -c groko --out results.json
```

Das Node.js-Skript zum Auswerten der Daten liegt in `analyse/analyse.js`. Hier muss noch die jeweils aktuellen Politiker und Ministerien eingetragen (oder importiert) werden. Die Rohdaten aus der Datenbank sollten im Ordner `analyse/input` liegen:

```
$ node analyse.js
```

Die Ergebnisse der Auswertung werden als CSV im Ordern `output/` gespeichert. 

### Entwickeln

Zum Entwickeln und Bauen des Projekts wird [Node.js](https://nodejs.org/en/) benötigt. Die [Sass](http://sass-lang.com/)-Stylesheets werden mit libSass und Grunt kompiliert:

1. Gebenenfalls Grunt-CLI installieren `npm install -g grunt-cli`
2. Watcher starten: `grunt watch`

Zum lokalen Entwickeln ist ein kleiner [HTTP-Server](https://github.com/indexzero/http-server) integriert. Diesen kann man mit dem Befehl `npm start` starten. Der Server läuft unter http://localhost:8080. Beim Starten des Entwicklungsservers sollte automatisch ein neues Browserfenster aufgehen.

### Verbesserungen
- für Mobilgeräte optimieren
- Datenmodell und Funktionen stärker trennen
- auf ein Frontend-Framework (Vue, React) umstellen
