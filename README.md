# MySTK

## Dev

### pnpm

Le package manager utilisé est [pnpm][why pnpm] :

#### Pré-requis

```shell
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

cf. [documentation][install pnpm] pour windows ou autres manières d'installer pnpm.

[why pnpm]: https://pnpm.io/motivation
[install pnpm]: https://pnpm.io/installation#on-posix-systems

#### Commandes usuelles

- installer les dépendances  

  ```shell
  pnpm install
  ```
  
- ajouter un paquet

  ```shell
  pnpm add <nom-du-paquet>
  ```

- lancer un script défini dans package.json

  ```shell
  pnpm run build:android:debug
  ```

- utiliser les binaires issus des dépendances

  il suffit de préfixer la commande par pnpm :

  ```shell
  # si @ionic/cli est une dépendance du projet, il fournit le bin `ionic`
  pnpm ionic 
  ```

### workflow dev

Les scripts du package.json regroupent des commandes utiles pour le développement de l'application : 

- `pnpm run serve` permet de lancer l'application dans un dev-server local pour utiliser l'appli en mode web
- `pnpm run build` lance le build de l'application web (mode production)
- `pnpm run build:android` lance le build de l'application android selon le dernier mode choisi (aab ou apk)
- `pnpm run build:android:apk` lance le build de l'application android en forçant le mode apk
- `pnpm run prepare:android:no-build` permet de copier l'application web précédemment built dans le projet android avec les icônes et ce qui est défini dans config.xml

### Icones

- [générateur d'icônes Android et iOS][iconKitchen icon]
  - ajouter [resources/ic][ic-logo-svg]

[iconKitchen icon]: https://icon.kitchen/i/H4sIAAAAAAAAA1WQwUrEMBCG32W8dmFtXaQ9ugcRFYTtTWSZNmkaNmlikipl2Xd3Jl1BL23zZeab6X%2BGLzSzjNCcQWA4taO0EpoUZllAp9rF0wlUQKHllKCAxAUCmgFNpJJB7Y32GBILoqQXCDngbLhW924igEIce2ctCy7ccrVqi0pSWacOI2YSP2cderPCvTMuELy52%2B7KWmT2%2BLsITev5%2FvZfQUYlo6qq7uuKEE6KfM2m3ubRb7SMnhT3J%2BeJl7sCglYjKfN351Jy9nowclg59frY6sQqeF0O7TOpfXwg0Z%2FxPj7lP17T8%2FEFFzdzJCNdDtrICTlcyuVol5hOnIZ1Yjac%2FzutKoLTLNIu0vNbdiw1uGxickHCx%2BUHTDmhga8BAAA%3D
[ic-logo-svg]: ./resources/ic-logo%20mySTK.svg
