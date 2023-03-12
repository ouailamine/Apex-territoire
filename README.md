# Bienvenue sur l'application Apex Territoire


Dans la suite nous détaillons les objectifs et le guide d'utilisation d'Apex Territoire.
Vous pouvez directement commencer et cliquer sur l'onglet Carte puis
revenir sur le guide d'utilisation pour avoir plus d'informations sur les fonctionalités implémentées.
Apex Territoire est aussi accessible sur mobile et tablette.


##  Objectifs

Apex territoire fait suite, et  complémentaire à l'application Apex Vignes.
L'objectif premier d'Apex Territoire est de proposer aux utilisateurs une 
<b>visualisation et une analyse spatio-temporelle de la croissance des apex telle qu'elle a été observée dans les parcelles de vignes.</b>
Autour de cet objectif, nous avons implémentés de nouvelles fonctionnalités permettant 
aux utilisateurs d'<b>ajouter</b>, de <b>mettre à jour</b> de <b>partager</b> et d' <b>exporter</b> les résumés de leurs observations.
Ainsi, en plus de proposer une visualisation géolocalisées des indicateurs de croissance des apex,
Apex Territoire est aussi une plate forme qui permet la mise à jour et le partage de résumés d'observations. 
Ces dernières fonctionnalités permettent de comparer et de mieux comprendre la croissance des apex des vignes à travers différentes campagnes et différentes parcelles.
Pour satifaire ces objectifs les fonctionalités suivantes ont été implémentées :



    
##  Carte

La carte permet de localiser par des icones à la fois : a) les parcelles observées par l'utilisateur 
et b) les parcelles pour lesquelles l'utilisateur est destinataire d'un partage d'observations.<br/>
<b> * Sélectionner une campagne, une semaine et une parcelle d'intéret </b> à l'aide des menus de controles situé en haut de pages pour  recentrer la carte sur . <br/>
    
<b> * Accéder aux informations résumés sur la croissance des Apex </b>  en cliquant sur l'icone représentant la parcelle.
Chaque icone localisée sur la carte prend une couleur du vert pale au vert foncé en fonction
de son indice de croissance, ou grise si il n y a pas d observations.<br/>
    
    
<b> * Comparer la croissance des Apex de la campagne précédente</b> en passant le curseur sur le bouton campagne précédente. <br/>
    
<b> * Visualiser les indicateurs de croissance de la parcelle </b> pour la semaine et la campagne séletionnées, dans le panneau de droite.
Ces indicateurs de croissance  proviennent de l'application Apex Vignes et sont instantannément recalculés en fonction des nouvelles données mises-à-jour par l'utilisateur.


##  Editer


Cette fonctionnalité permet d'ajouter ou de <b> mettre à jour le résumé des observations  sur l'état des Apex </b>  collectées dans les parcelles.
Les informations mises à jour peuvent concerner à la fois, les résumés d'observations collectées par l'utilisateur, ou encore
les résumés d'observations reçus d'autres utilisateurs.
Les mises à jour effectuées par un utilisateur sur les résumés d'observations collectés ou reçus restent locales à l'utilisateur.
Ces mises à jour ne sont visibles que par l'utilisateur et ne suppriment, ni les observations collectées par l'utilisateur, ni les observations partagées par un autre utilisateur.
En cliquant sur Réinitialiser, tout utilisateur a la posibilité d' <b> effacer ses mises à jour afin de retrouver les résumés d'observations initialement collectées </b>.


## Partager


La fonctionnalité de partage permet de <b>  partager les observations collectées par un utilisateur sur une parcelle  avec un autre utilisateur </b> .
    Les observations partagées ne concernent que le résumé des observations collectées sur le terrain par l'utilisateur avec l'application Apex Vignes.
    Le partage ne concerne pas les mises à jour de résumés qui eux restent locales à la session d'un utilisateur.
    Afin de controler le partage d'observations entre utilisateurs, un utilisateur ne peut partager que les résumés des observations qu'il a lui meme collecté.
    Un utilisateur ne peut pas re-partager les résumés d'observations qu'il a reçu d'un autre utilisateur.
    Un utilisateur peut décider d'<b>arrêter le partage des informations sur une parcelle avec un autre utilisateur </b> en cliquant sur supprimer.
    

## Exporter


Cette fonctionalité permet d'exporter au format pdf ou csv les résumés d'observations collectés et reçus par l'utilisateur.
<b>Les résumés d'observations se composent les indicateurs de croissances des apex et de contraintes hydriques d'une campagne sélectionnée </b>.
L'export de données présente en plus dans un tableau récapitulatif contenant la valeur de tous les indicateurs calculés pour chaque semain de la campagne.

    
## Authentification


Cette fonctionalité accompagne le partage des résumés d'observations collectées par les utilisateurs.
    Elle permet aux utilisateurs qui le souhaitent de <b>protéger l'accès à leurs données </b> par un mot de passe.


## Contributeurs


L'application Apex Territoire est à l'initiative de Léo Pichon (porteur du projet).
    <b>Pour toute information contactez leo.pichon@supagro.fr</b>.
    Cette aplication a bénéficié du développement de la cellule d'appui en informatique
    de l'institut de convergence <a href="https://www.hdigitag.fr/fr/"> #Digitag</a>. 
    L'application a été développée par Vincent Armant et Amine Ouail à la demande de Léo Pichon et Guilhem Brunel.
    L'application reprend les éléments graphiques et les indicateurs de croissance développés dans <a href="https://play.google.com/store/apps/details?id=ag.GB.apex&hl=en">ApeX Vignes</a>.



## Comment installer le projet
```
unzip apex-territoire.zip
cd apex-territoire
npm install
```

### Compilation et rechargement automatique du client
```
cd apex-territoire/client
npm run serve
```

### Compilation et rechargement automatique du serveur
```
cd apex-territoire/
npm run dev
```
