# Jeu instantané Facebook "Ravioliste" (*Ravioliste-fb_instant_game*)
Facebook instant game (Jeu instantané) fait pour la campagne **AEDI** 2020 par la **Ravioliste**.

## Description du jeu
### GamePlay
En incarnant un personnage, qui court indéfiniment, il faut éviter les obstacles en tout genre et attraper le maximum de raviolis afin de faire le plus haut score possible.

### Fonctionnalités
Les obstacles peuvent :
* tuer sur contact vertical et horizontal
* tuer sur contact horizontal et stopper la translation verticale (gravité/saut) sur contact vertical
Le score augmente continuellement un petit peu
Un ravioli rapporte 1000 points de score instantanément

### Fonctionnalités Facebook
* Un message peut être envoyé au lancement du jeu (*si messages enable  & ANTI SPAM inactive*)
* Un message peut être envoyé lorsque le meilleur score du joueur est battu (*si messages enable & (ANTI SPAM inactive or best_score > 10000)*)
* Un message sera envoyé lors d'un clic sur le ravioli en haut à droite de l'écran d'accueil : '*easter egg*' utile pour partager le jeu sans afficher la video de présentation
* Un classement du top 10 des joueurs sera disponbile : **Attention** Ce classement est relatif au *contexte* c'est à dire à la converstation dans laquelle le jeu est joué. Il est en donc de même pour votre meilleur score.

## Fichiers
* **index.html** : affichage html + scripts facebook (score/leaderboard + messages) + scripts d'affichage
* **main.js** : corps du code (assetsLoader, canvas, Sprite, Player et fonctions globales du jeu : jump(), animate(), gameOver())
* **blocks.js** : gère la génération de pattern (Pattern et PatternProvider) et les blocks + collision (Block)
* **patterns.json** : stockage des différents patterns
* **style.css** : stylesheet
* **autres** : fichiers de config de facebook
* **assets/** : contient les images utilisées

### Liens externes
* Samples https://github.com/fbsamples/fbinstant-samples
* Fb developer link https://developers.facebook.com/apps/2974553519263927/dashboard/
* Quelques tutos http://phaser.io/tutorials/getting-started-facebook-instant-games/part1

## License 
MIT License

Copyright (c) 2020 Doreapp (Antoine MANDIN)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
