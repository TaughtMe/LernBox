Anleitung zur Nutzung der LernBox PWA
Diese Anleitung beschreibt, wie Sie die LernBox-Anwendung verwenden können.

Variante 1: Einfachste Nutzung (aus einem Ordner)
Ideal für die schnelle Weitergabe per USB-Stick oder Download, wenn keine Installation möglich ist.

ZIP-Datei erhalten: Sie erhalten eine Datei, z.B. LernBox-v1.zip.

Entpacken: Klicken Sie mit der rechten Maustaste auf die ZIP-Datei und wählen Sie "Alle extrahieren..." oder "Entpacken". Es wird ein normaler Ordner mit demselben Namen erstellt.

App starten: Öffnen Sie den neuen Ordner und doppelklicken Sie auf die Datei index.html. Die Anwendung startet sofort in Ihrem Standard-Webbrowser. Ihre Lernfortschritte werden direkt im Browser gespeichert.

Hinweis: In diesem Modus sind eventuell nicht alle PWA-Funktionen (z.B. die "Installieren"-Schaltfläche im Browser) verfügbar. Die Kernfunktionen sind jedoch uneingeschränkt nutzbar.

Variante 2: Vollständige PWA-Nutzung (mit lokalem Server)
Diese Methode wird für den Projektverantwortlichen (Lehrer) oder technisch versierte Nutzer empfohlen, um die volle Offline- und Installationsfunktionalität zu erleben.

Voraussetzungen: Auf dem Computer muss Node.js installiert sein.

Projektordner öffnen: Öffnen Sie den vollständigen Projektordner (nicht nur den dist-Ordner) in einem Terminal oder einer Kommandozeile.

Produktions-Vorschau starten: Führen Sie den folgenden Befehl aus und drücken Sie Enter:

Bash
npm run preview

App im Browser öffnen: Das Terminal zeigt Ihnen eine lokale Adresse an (z.B. http://localhost:4173). Öffnen Sie diesen Link in einem modernen Webbrowser (wie Chrome, Edge oder Firefox). Nun können Sie die App mit vollem Funktionsumfang nutzen und sie über die Adressleiste auch als "echte" App auf Ihrem Computer installieren.
