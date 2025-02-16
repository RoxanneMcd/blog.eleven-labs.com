---
layout: post
lang: fr
date: '2015-11-12'
categories:
  - php
  - architecture
authors:
  - nkania
excerpt: >-
  Explication du design pattern State et exemple d'implémentation dans une
  application Symfony via winzou/state-machine-bundle
title: Pattern State
slug: pattern-state
oldCategoriesAndTags:
  - php
  - architecture
  - symfony
  - design pattern
permalink: /fr/pattern-state/
---

> **- Qu'est-ce que c'est ?**

Le design pattern State, ou patron de conception Etat, permet la modification d'un objet en fonction de son statut. Pour faire simple, il vous permet d'exécuter des actions en fonction d'un contexte.

Prenons un exemple. Imaginons que nous voulions mettre en place un système de traitement et de publication de vidéo avec le workflow suivant :

- Demande de création
- Récupération de la vidéo
- Encodage + traitements
- Envoi sur une plateforme de diffusion
- Publication

Nous pourrions donc décider de traiter chaque demande unitairement de bout en bout, mais cela nous forcerait à rendre interdépendants les différents traitements et rendrait le code difficile à faire évoluer et à maintenir par la suite.

Ou alors, nous pouvons décider d'utiliser le pattern State afin de gérer ces différentes étapes indépendamment.

> **- Comment ça marche ?**

Si nous reprenons l'exemple de notre vidéo ci-dessus, nous pouvons donc dégager plusieurs étapes utiles à notre workflow :

- *create*
- *download*
- *encode*
- *upload*
- *publish*

Cependant, ces étapes ne sont que des transitions, rien ne nous permet d'identifier qu'une étape est terminée, ce qui est gênant. Comment savoir que le téléchargement de la vidéo s'est bien déroulé et est terminé pour pouvoir passer à la suite ?

Nous avons donc besoin d'ajouter des statuts :

- *new*
- *creating*
- *created*
- *downloading*
- *downloaded*
- *encoding*
- *encoded*
- *uploading*
- *uploaded*
- *publishing*
- *published*

De cette manière, nous pouvons facilement savoir dans quel état se trouve notre objet à l'instant T.

Dans le pattern State, les étapes n'ont pas conscience des autres. Elles n'ont qu'un but : faire passer notre objet d'un statut à un autre. Il faut donc définir le contexte de chaque étape. Celui-ci va permettre d'indiquer à quel moment une étape doit se déclencher sur l'objet en cours.

Imaginons le cas suivant :

- On reçoit une demande de création de vidéo :

 * L'étape *create* est lancée
 * Notre objet passe en status *creating*
 * Une série de traitements s'effectue
 * Notre objet passe en statut *created*

A partir de ce moment, nous avons donc un objet en état *created*.

- La prochaine étape logique de notre workflow est donc l'étape de *download*:

 * L'étape *download* détecte que nous avons un objet en état *created* :
 * L'étape *download* est lancée
 * Notre objet passe en statut *downloading*
 * Une série de traitements s'effectue
 * Notre objet passe en statut *downloaded*

Et ainsi de suite jusqu'à arriver à l'état published qui indique la fin de notre workflow (en effet, aucune étape n'est configurée pour débuter sur ce statut).

> **- Dans quel cas l'utiliser ?**

De mon opinion, ce pattern est très pratique dans des cas assez complexes où beaucoup d'étapes sont nécessaires à l'élaboration d'un objet.

Il est très souple et permet très facilement d'ajouter/modifier ou supprimer des étapes sans pour autant mettre en péril notre workflow.

Cependant, il reste des cas où il est inutile de l'utiliser, par exemple, sur un workflow assez simple. En effet, ce pattern est assez lourd à installer, donc il ne présenterait pas de gros gains. Il impose en effet une certaine manière de penser et de fonctionner qui n'est pas forcément courante.

> **- Cas concret avec le bundle Symfony winzou/state-machine-bundle**

Ce bundle permet la mise en place d'une state machine assez facilement. En effet, il se base en grande partie sur de la config pour la gérer automatiquement. Vous pouvez trouver son dépôt ici : [https://github.com/winzou/StateMachineBundle](https://github.com/winzou/StateMachineBundle){:rel="nofollow noreferrer"}

Dans notre cas, la configuration du bundle pourrait ressembler à ça :

```yaml
# app/config/config.yml

winzou_state_machine:
    my_bundle_video:
        class: My\Bundle\Entity\Video
        property_path: state
        graph: simple
        # list of all possible states:
        states:
            - creating
            - created
            - downloading
            - downloaded
            - encoding
            - encoded
            - uploading
            - uploaded
            - publishing
            - published
        # list of all possible transitions:
        transitions:
            create:
                from: [new]
                to: created
            download
                from: [created]
                to: downloaded
            encode
                from: [downloaded]
                to: encoded
            upload
                from: [encoded]
                to: uploaded
            publish
                from: [uploaded]
                to: published
        # list of all callbacks
        callbacks:
            # will be called before applying a transition
            before:
                set_transitional_state:
                    on:   ['create', 'download', 'encode', 'upload', 'publish']
                    do:   [@my.awesome.service, 'setTransitionalState']
                    args: ['object']
```

De cette manière, chaque étape sait à quel statut elle doit se déclencher, fera appel à une méthode `setTransitionalState` qui se chargera de mettre à jour le statut en début d'étape (*creating*, *downloading*,...), et enfin définira le statut de fin lorsqu'elle aura terminé.

Ensuite, il suffira juste de choisir de quelle manière activer chaque étape. On peut très bien imaginer la réception d'un call POST sur une url afin de déclencher l'étape *create*, puis des crons s'occupant de récupérer les objets vidéos et de les traiter en fonction de leurs statuts.

> **- Conclusion**

Pour conclure, je pense que ce pattern est utile dans des workflows assez complexes où vous désirez découpler chaque étape. Il est possible de faire des choses très poussées qui n'ont pas été abordées dans cet article (toute la gestion d'erreur par exemple, car relancer une étape ne nécessite qu'un changement de statut).

See ya!
