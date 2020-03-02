# Ravioliste-fb_instant_game
Facebook instant game (Jeu instantané) fait pour la campagne AEDI 2020 par la Ravioliste

## Développement 
# En cours (A l'attention de Dems):
J'ai commencé à développer la visualisation des "blocks" (le sol)
J'ai fais ça en considérant l'espace du jeu comme quadrillé, ça sera plus simple pour les patterns et leur stockage
Je vais continuer sur (justement) l'enregistrement de pattern et leur enchainement infini dans le jeu
Ensuite je pense qu'il faudra commencer à développer la physique (gravité + collision avec blocks)
*Je pense d'ailleurs que la collision avec les blocks ne va pas être simple, car il y 3 cas possibles :*
* *Le joueur arrive par le haut, il arrête donc de tombé*
* *Le joueur arrive par le bas: soit il s'arrête de sauté soit il passe à travers, au choix*
* *Le joueur arrive de face: dans ce cas là la partie est finie..*
*Différencier les cas me parrait assez compliqué, a réflechir.*

### Fait 
Ecran d'acceuil
* Logo de la liste *(x) fait*
* Bouton jouer *(x) fait*
* Affichage des informations sur le joueur (photo, nom?) *(x) fait*

### Désormais
Développement du jeu
* Un objet joueur, qui cours *assets fait* 
* Un objet ground, qui est solide (au début simplement horizontal infini et défillant)
* La physique du joueur (saut, gravité, contact avec le sol)
* Ajout de varations : trous dans le sol, plateformes volantes. Et de leur physique (contact avec le joueur)

### Idées
* Fonctionner avec de l'aléatoire, et des paterns --> une dix-vingtaine de paterns par thème. 
* Patern = ensemble d'objets. En mettant des pattern à la suite on créer un parcours plus ou moins cohérent
* Gérer le score, avec l'outil leaderboard fourni par Facebook. Afficher le meilleur score au menu.

### Liens externes
* Samples (bof) https://github.com/fbsamples/fbinstant-samples
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
