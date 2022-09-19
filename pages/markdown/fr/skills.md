

# Performance
## C / C++
### Gestion de la mémoire, Frama-C
Repérage des fuites mémoires avec Valgrind, prévention des bugs avec Frama-C

### OpenMp / MPI
Optimisation CPU multi-coeur avec OpenMP et multi-CPU avec MPI
### Cuda
Exportation de script CPU vers GPU via le sdk Cuda de Nvidia, réalisation d'un programme optimiser au maximum permettant d'appliquer des filtres sur des images. 

## Python ?!
### Théorie des graphes 
Réalisation d'un script pour résoudre un problème classique de théorie des graphes ( Min-Cut ), compilation Just-In-Time et multi-threading
### Web-Scrapper
Dans le cadre de la réalisation d'un Web-Scrapper ( voir partie Data ), optimisation du script pour réaliser des requêtes asynchrone, utiliser le système de compilation Just-In-Time de python, ainsi que multi-threading pour parser le résultat

## Rust
### WebAssembly
Réalisation d'un mini-jeu 2D de construction pour le web 100% avec WebAssembly

# Développement Natif

## C#
### Unity
- Création d'un mini-jeu dans le cadre d'un projet universitaire, ayant pour but d'exploiter un maximum de fonctionnalitées proposer par le moteur : multijoueur via Netcode, VFX et Shader-graph, création de plusieurs scènes, génération procédurales
- Création d'un clone partiel de Minecraft, avec la génération de terrain ( hauteur de la surface, biomes, structures, minerais / cavernes ), affichage des textures sur les voxels et gestion des ombres, inventaires, et permettre de casser / placer des blocs
- Via l'utilisation de Compute Shader ( Voir partie Performance avec **Cuda**, les deux sdk sont très proche ), création d'un Objet permettant d'ajouter des brins d'herbes en 3D sur n'importe quelle surface ( à l'image de l'herbe de Breath of the Wild ou équivalent ), avec prise en compte des objets sur cette surface, du joueur et du vent.

### Xamarin Forms 
Création d'une application mobile de gestion de projet avec connexion par mail, manipulation de timestamp et affichage de graphiques selon temps passées. 
## Dart
### Flutter
Création d'une application de discussion cross-platform, à l'image de whats'app ou équivalent, en utilisant Firebase. Cette application possède les fonctionnalités basiques d'une application de chat : pouvoir envoyer des messages texts, media ou sticker. Pouvoir créer / modifier / supprimer des groupes de discussions. Notifier les utilsiateurs d'un nouveau messages ( push ) sur leurs différents appareils. Pouvoir se connecter par mail ou via un provider, et pouvoir modifier son profil.
## Java / Kotlin
### Android 
Création d'un comparateur de prix avec le sdk Android natif en communication avec une API fait main en python ( flask )
### JavaFX
Création d'une application desktop de ventes aux enchères dans le cadre d'un projet universitaire, avec Mysql
## Javascript
### React Native
( En cours ) Projet personnel consistant à exportation du comparateur de prix réaliser sur Android pour React Native, avec l'objectif de partager les vues entre application webs et mobile ( mais en ayant un dom ( donc sans Flutter ), et sans webview ( donc sans blazor ou Ionic ))

# Développement Web

## Java 
### JavaEE
Création de serveurs webs ( fullstack ) avec Struts et JavaEE
### Spring
Création de webservices avec Spring, connexion par JWT, gestion des rôles par endpoints, communication avec BDD.

## Python
### Flask
- Création d'un serveur web basique ( à l'image de express en javascript )
- Création d'un service web avec une api REST proposant une authentification via JWT, et permettant de récupérer des informations via un scrapper ( avec différent outils comme Playwright, selenium, scrappy...)

## Php
### Wordpress
Stage conventionné de 4 mois dans l'Agence web [EKELA](https://www.ekela.fr). Ce stage m'aura permis de me professionnaliser, d'acquérir des compétences avancées en développement web via Wordpress, ainsi que des notions d'ux design et de SEO.
### Symfony
- Réalisation d'un site web complet avec Symfony ( fullstack )
- Création d'une API via **Api-Platform**, en utilisant **Angular** comme Front

## Javascript
### Angular
Création d'un Front pour une application web de gestion avec features basiques comme authentification via JWT
### React + Next
Création de mon propre site ( celui sur lequel vous lisez ces lignes ) avec React et NextJS, vous trouverez plus d'info sur la page de blog dédiée.
### Vue + Svelte + Astro
( En cours ) Création d'un prototype / boilerplate intégrant la plupart des features basiques à un site web, via le Meta-Framework Astro et différents Framework UI comme Vue et Svelte, ainsi que plusieurs micro-services permettant entre autre, l'authentification, l'envoi de mail, la recherche via Meilisearch...

# Data

## Sql

### MySql, Sqlite, Postgres
- Différentes expérience d'exploitation de bases de données, dans le cadre de plusieurs projets ( Data ou Non ) 

## Python

### Web-Scrapper
Création d'un scrapper pour des pages de produits, récupération des données dans différents contextes : contenu html basique, api, pages nécessitant javascript, application mobile...

### Bases de l'IA 
- Apprentissage des bases de l'ia via algorithmes de recherche locale, recherche de chemin, backtracking
- ( En cours ) Mises en place d'un réseau de neuronnes ayant pour objectif de trouver des similarités entre des pages proposant des produits à la vente ( et de déterminer si ces pages proposent effectivement quelque chose à vendre )

### Qgis
- ( En cours ) Création de script pour le logiciel de géomatique QGIS

## R

### Classifieur de page Web
Création d'un classifieur automatique de pages html de blogs, après nettoyage du corpus en utilisant un SVM