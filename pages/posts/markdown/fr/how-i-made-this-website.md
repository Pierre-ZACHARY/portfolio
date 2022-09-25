---
title: "Comment j'ai créé mon site"
date: '2022-09-21'
description: "Dans ce poste j'explique les différentes technologies que j'ai utilisé, comme **Next** et **React**, et les décisions que j'ai pris pour créer mon portfolio."
---

Vous souhaitez savoir comment j'ai créer mon site ? Vous êtes au bon endroit, dans ce poste, je vais détaillé les différentes technologies que j'ai utilisé et pourquoi je les ai choisies.

# Le Framework

La première étape était de choisir le Framework pour construire mon site. Le seul framework javascript que je connaissais jusque là était Angular, cependant lorsque je démarre un nouveau projet personnel, j'apprécie essayer un nouveau langage ou une nouvelle technologie pour moi.

## Next & React

Encore aujourd'hui, **React** est toujours le framework front-end le plus populaire, et comme je ne l'avais jamais utilisé, c'était l'occasion pour moi de l'essayer.
Cependant, React seul n'est pas idéal pour certaines raisons comme le **SEO**, ou le **temps de chargement** de la page, étant donné que l'application a besoin de chargé l'ensemble du javascript avant d'afficher un DOM, et pour cette raison, les robots qui parcourraient la page pourraient ne pas trouver les balises internes à la page.
Pour résoudre ce problème, vous pouvez utiliser un autre framework permettant de faire le rendu de la page courante sur le serveur, avant de l'envoyer au client. **Next** est un framework populaire permettant de faire ça.

Vous pouvez alors vous demandez quel est mon avis sur ces deux frameworks ? 

Well, at first I have to say that they are very intuitive to use :
Premièrement j'aimerai dire que ces deux frameworks auront été très faciles à prendre en main :
- React possède une **architecture basée sur le pattern Composite**, ce qui rend vos vues très réutilisables. En plus de cela, les hooks basiques de react comme **useState ou useContext** sont très simple à prendre en main.
- Next s'occupera du routing de l'application à la place de React, en fonction de votre architecture de fichiers, y compris pour les chemins dynamiques. De plus, si le contenu de votre page est dynamique, Next permet de choisir la méthode de rendu qui vous serait idéal, avec le SSG, SSR, ISR ou encore CSR : 
  - **Server Side Generation**, cela permet de faire le rendu de votre page seulement lors du build du serveur
  - **Server Side Rendering**, cela permet de recharger votre page à chaque requête, ou lors d'une requête après un nombre de temps donné
  - **Incremental Server side rendering**, pour les sites qui possèderaient un nombre indéterminé de chemin, ou un très grand nombre de pages à générer, rendant le build (trop) long, il est possible de ne faire le rendu statique de la page que lorsque la première requête pour ce chemin arrive, avec seulement une ou deux lignes de codes.
  - **Client Side Rendering**, le comportement classique de React, idéal quand vous avez besoin d'informations à propos du navigateur de l'utilisateur, comme la taille de sa fenêtre, le thème de son appareil... 
- De plus, Next possède plusieurs composants React pré-faits, comme next/Image, Script, Link, permettant d'optimiser le contenu de la page, ou d'effectuer des transitions vers d'autres routes comme sur une SPA, même s'il ne s'agit pas d'une SPA

Il y a cependant quelques inconvénients, Next ne vous permet pas d'optimiser des images venant de n'importe quel url, vous devez au préalable les importants sur votre serveur de stockage. Si vous utilisez **Storybook** avec Next, vous devrez adapter votre configuration pour pouvoir forcer le rendu de vos components, étant donné que Storybook ne supporte pas le SSR, et le rendre compatible avec Next/image.
Pour react, la façon de rafraichir l'affichage peut potentiellement causer des problèmes de performance. Sans parler du DOM virtuel, on risque rapidement de se retrouver avec une boucle infinie en plaçant un **setState dans un useEffect**, ou bien juste de recréer un component un nombre non-nécessaire de fois.
Aussi, si vous avez déjà essayé d'envoyer une notification à votre serveur quand votre client a fini de charger, vous devez savoir que depuis React 18, useEffect est toujours appelé 2 fois, il faut donc créer un nouveau hook pour éviter un second appel de fonction au chargement d'une page.
Sometimes I just want to change a specific variable in my pages, but since this variable is at the top of the page hierarchy, it'll **re-render all the page components**, not great for performances.
Parfois vous pouvez vouloir modifier une variable spécifique de votre page, mais comme cette variable appartient à une vue en haut de votre hiérarchie, cela provoque le rafraichissement de tous vos components, ce qui n'est pas nécessaire.
Enfin, quand vous souhaitez partager l'état d'un component, vous devez, par défaut, vous servir de useContext, ce qui peut vous demander de remonter très haut dans votre hiérarchie pour le faire.

## Redux
Pour ce dernier point, un outil très connu nommé **Redux** permet d'éviter d'avoir à toujours modifier son architecture. 
Redux permet d'envelopper votre application dans un seul context, et de rafraichir vos components seulement lorsqu'un changement d'état les concerne 
C'est très utile pour partager l'état de vos composants React.

Redux possède aussi plusieurs **dev-tools** permettant de vous aidez à observer l'état de votre application, revenir en arrière, mais aussi à partager l'état de l'application d'un utilisateur qui aurait eu un bug non-souhaité.

Selon moi l'inconvénient de Redux est qu'il y a beaucoup de code similaire à réécrire vous-même à chaque fois que vous voulez ajouter un état ou une nouvelle action.
Je sais qu'il existe plusieurs alternatives à Redux plus simples à utiliser, cependant Redux est le plus populaire pour gérer les états des applications React et je voulais d'abord l'utiliser pour me faire ma propre opinion.

## i18n & Next-Themes

Il existe plusieurs plugins notables avec Next, comme Next-i18n, une version serveur du plugin React du même nom, permettant de faire le rendu de vos textes traduits directement sur le serveur, ce qui est idéal pour le SEO.
Next-Theme propose certains hooks permettant de modifier le thème et appliquer des classes au body facilement, en plus de s'adapter au thème du système de l'utilisateur.

# Bases de données, outils et autres micro-services

Comme je ne suis pas un designer ou un développeur spécialisé en Front-End, capable de créer mes propres design, je voulais montrer en faisant ce site que j'étais capable d'intégrer **plusieurs fonctionnalités** à mon site, en utilisant différents microservices et outils dédiés.

## Framer Motion

Dans un premier temps, j'écrivais mes animations à la main, en utilisant la library d'animations React par défaut. Puis j'ai découvert **Framer Motion** et ses animations **Layout**, qui animate automatiquement n'importe quel changement dans le DOM d'un composants données, y compris un changement dans ses règles css.

En plus les animations qui utilisent Framer sont tellement fluide que j'ai préféré réécrire un certain nombre des miennes avec Framer.

Le seul problème que j'ai repéré est que les animations Layout à l'intérieur d'un composant "fixed" (un header par exemple) provoque des défauts lors d'un changement de page avec le routeur de Next.

## Firebase

La fonctionnalité la plus classique sur toute application est authentification. Je dois dire qu'avec Firebase, il n'y a pas énormément de travail à faire pour la réaliser.

Firebase m'a permis de mettre en place facilement la connexion des utilisateurs, cela comprend l'envoi de mail comme le fait de modifier son mot de passe, ainsi que stocker les informations propres à chaque utilisateur, comme les commentaires, avec sa base de données en temps réel **Firestore**
J'ai aussi utilisé la fonctionnalité de stockage pour uploader des photos lors de l'envoi de commentaires.

Je n'ai pas grand-chose d'autres à dire en dehors de l'expérience développeur très satisfaisante. Je sais que Firebase devient cher lorsque le nombre d'utilisateur actif devient intéressant, mais pour mon site web cela semblait suffisant.

## Spline

Comme la 3D devient de plus en plus populaire à l'intérieur des applications webs, je voulais ajouter quelques scènes à la mienne. J'ai quelques connaissances basiques en 3D, j'ai une expérience de réalisation d'un mini moteur de jeu avec OpenGLES pour Android, et j'ai aussi un peu utilisé Blender pour la modélisation de quelques objets basiques pour un jeu Unity.

Pour mon site, je voulais une solution très simple à prendre en main, et Spline a très bien répondu à ma demande. Leur application web vous permet de modéliser vos objets, créer des matériaux basiques et ajouter des events que vous pouvez appeler via du code javascript. Il y a même un **SDK React** ce qui permet d'intégrer très facilement votre scène sur votre site.

De manière générale, vous êtes très limité sur ce que vous pouvez faire par rapport à blender, cependant, cela est idéal pour le web. Vous pouvez même réalisé un benchmark de votre scène pour savoir si elle ne risque pas de détruire les performances de votre site.

## Chatbot fait-main

Un chatbot est une fonctionnalité très commune pour le web, cela permet aux utilisateurs de prendre contact avec vous sans avoir à passer par l'envoi de mail ou autre moyen, et potentiellement recevoir une réponse immédiate.

J'ai déjà eu l'opportunité de créer des chatbots, dans mes autres expériences de développeur web. Mais, le plus souvent on utilise un SDK existant et une app déjà construit, ce qui a un coût.

L'autre option que j'avais était d'utiliser une application existante, comme **Discord** ou Slack, et de partager les messages du chatbot entre un salon de l'application et mon site. Le SDK pour créer un bot discord est disponible dans deux langages : **Javascript (node) et python**
Dans mon cas, le mieux serait d'héberger le bot discord sur le serveur web qui utilise déjà node.js. Malheureusement je ne peux pas faire ça à cause des limitations de mon hébergeur (Vercel), qui ne permet pas de garder un websocket ouvert indéfiniment, ce qui est potentiellement nécessaire pour un chatbot ( au moins plusieurs minutes ... ).
J'ai alors choisi d'héberger mon bot discord sur **Heroku**, j'ai écrit un petit script **Python**, pour ouvrir un websocket sur un endpoint, écouter les messages provenant de ce websocket et les retransmettre sur discord (et inversement).

Malheureusement j'ai appris quelques semaines après qu'Heroku arrêtera bientôt de proposer son service gratuitement, j'ai prévu de migrer mon bot sur **Railway** d'ici là.

## Medusa

Une autre fonctionnalité très commune sur le web est l'**e-commerce**. J'avais déjà quelques expériences avec **shopify**, mais j'ai jamais eu l'occasion d'intégrer un front à un site existant. De plus je souhaitais tester une alternative **open-source**

[Medusa]("https://medusajs.com/") est une plate-forme d'e-commerce open-source composé **3 services** : Le serveur, le panneau d'administration, et éventuellement le front du shop. Le serveur est une Api REST qui s'occupe des interactions entre Admin et Client, que ce soit pour remplir le panier ou passer commande.

Medusa possède aussi son propre **client javascript** permettant de l'intégrer facilement à votre site.

Le seul point négatif que je pourrais noter est que Medusa peut **manquer de fonctionnalités**, concernant la customisation de vos produits, ou encore le fait de devoir choisir une adresse de livraison, y compris si votre produit est digitale. De plus j'aurais aimé pouvoir proposer des abonnements, pour passer commande automatiquement tous les x temps. 

Pour information, j'ai utilisé **Stripe** et **Paypal** pour gérer les paiements.

## Storybook

Le dernier outil que j'aimerais présenter est **Storybook**. Je l'ai déjà mentionné en disant qu'il n'était pas facile de l'intégrer avec Next, mais Storybook a de vrais atouts.

Storybook permet de **tester vos components en isolation**, ainsi que de réaliser des tests de **régression visuel**, pour savoir s'il y a eu une modification visuel entre deux commits. De plus si vous utilisez **Figma** pour maquetter votre UI, il est très facile d'intégrer vos composants Figma dans Storybook.

# Ce que je modifierais si je devais refaire mon site
Le premier problème que j'ai avec mon site est le grand de nombre de rafraichissements de l'ensemble de mes composants à cause de l'architecture de React. Cela pourrait encore être largement optimisé en s'attardant sur chacun, ou alors il existe des alternatives à React, comme Solid, évitant ce genre de problème.

Another point that I don't like is that there is no way to chose **when to load a specific component**.
Un autre point qui m'embête est qu'il n'y a pas vraiment de façon de choisir **quand un component doit être chargé** par défaut.
Vous pouvez le faire en chargeant un script, avec le composant Next/Script, mais pour les components React vous pouvez seulement choisir de les Lazy Load avec React **Suspense** (mais cela execute le code Javascript du component concerné dès le chargement de la page, seul composant ne s'affiche pas).
Dans mon cas, je souhaitais empêcher de charger un composant tant que la page n'est pas fini de charger, et pour cela j'ai eu besoin de créer un nouveau component...

Les frameworks les plus récents permettent de gérer ça en utilisant une **architecture par îlots**. Cela vous permet de choisir, pour chaque élément de votre page, quand envoyer le javascript au client ( **hydratation partielle** ).
Deux frameworks intéressants adoptant cette architecture sont [Astro]("https://astro.build/") et [Fresh]("https://fresh.deno.dev/"). En plus de ça, Astro vous permet d'utiliser **n'importe quel framework Front**, comme React Angular ou Vue, pour vous permettre de changer à tout moment, ou de travailler avec des développeurs qui n'utilise pas forcément tous le même framework.
La deuxième chose dont je voudrais parler est qu'il aurait été une meilleure expérience de développeur pour moi si j'avais adopté l'architecture par microservices dès le début de mon développement. Cela signifie qu'il aurait été plus pratique de regrouper tous mes services au même endroit en utilisant **Docker ou Kubernetes**, plutôt que d'hébergez mes services à plusieurs endroits avec Vercel, Heroku ou encore Railway... Cela aurait aussi permis de réduire le temps de communication entre chaque service.
Dans ce contexte, j'aimerais essayer d'utiliser des solutions un peu plus open-sources que celles que j'ai utilisées, pour pouvoir les héberger localement. Comme alternative à Firebase je pourrais me servir de [Supabase]("https://supabase.com/"), [Appwrite]("https://appwrite.io/"), ou encore [SurrealDb]("https://surrealdb.com/").
Aussi, si je devais refaire mon site depuis le départ, je commencerais par mettre en place [Meilisearch]("https://www.meilisearch.com/"), pour pouvoir indexer chacune de mes pages, ce qui me faciliterai le fait de mettre en place un système de recherche globale. 
J'aurais aussi commencé par mettre en place un serveur DHCP pour centralisé l'envoi de mail.

Un autre type de microservices que je n'ai pas du tout utilisé ici, sont tout ce qui concerne le traitement des erreurs ou les analytics. Deux outils open-sources pour ces tâches seraient [GlitchTip]("https://glitchtip.com/") et [Plausible]("https://github.com/plausible/analytics").

Enfin, j'utilise actuellement le système de fichier ainsi que le format markdown en tant que CMS dans mon dépôt git. Cela me donne une bonne expérience de développeur mais ce n'est pas idéal comme CMS à partager avec des personnes non-initié. Une façon plus adéquate à tous de gérer le contenu du site serait d'utiliser un outil adapté, comme [Strapi]("https://strapi.io/") ou [Tina]("https://tina.io/").

# Codepen & autres sources d'inspirations

J'aimerais ajouter que j'ai été inspiré par plusieurs réalisations, sur codepen ou autre :
- [The javascript confetti screen]("https://codepen.io/Gthibaud/pen/ENzXbp") de Gthibaud, que j'ai utilisé pour la page commande validée.
- [FontAwesome]("https://fontawesome.com/"), tous mes icons viennent de leur version gratuite.
- [The magic card effect]("https://codepen.io/gayane-gasparyan/pen/jOmaBQK") de Gayane, que j'ai utilisé pour les cartes de mes posts.
- [The chat notification widget]("https://codepen.io/coswise/pen/NWqNWqe") de Cosimo Scarpa, je n'ai pas utilisé son code, mais j'ai refait quelque chose de similaire avec Framer
- [The drag confirm button]("https://codepen.io/coswise/pen/LYNaJrO") aussi de Cosimo Scarpa, que j'ai utilisé pour mon bouton de déconnexion sur ma page profile utilisateur
- [A little credit card animated button]("https://codepen.io/TurkAysenur/pen/wvaGqXW") de Aysenur Turk. Je l'ai utilisé pour mon bouton de validation de paiement par carte bleue.
- [The blog of Maxime Heckel]("https://blog.maximeheckel.com/"), pour obtenir des informations sur Framer (en plus de la documentation officielle)
- Je me suis aussi énormément inspiré du travail d'[Aaron Iker]("https://codepen.io/aaroniker")


