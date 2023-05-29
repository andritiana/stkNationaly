# MySTK

## Dev

### Pré-requis

#### pnpm

Le package manager utilisé est [pnpm][why pnpm] :


```shell
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

cf. [documentation][install pnpm] pour windows ou autres manières d'installer pnpm.

[why pnpm]: https://pnpm.io/motivation
[install pnpm]: https://pnpm.io/installation#on-posix-systems

#### Android

- java 11
  - instructions pour installer via sdkman
    - installer sdkman

      ```shell
      curl -s "https://get.sdkman.io" | bash
      # suivre les instructions
      # à la fin, ouvrir un nouveau terminal
      ```
  
      voir [sur le site][sdkman install] pour Windows

    - utilisation

      ```shell
      # dans le dossier du projet, la première fois
      sdk env install
      # configurer sdkman pour qu'il gère la version automatiquement en entrée et en sortie du dossier
      sdk config # mettre sdkman_auto_env=true
      # manuellement
      sdk env # clear en sortie du dossier
      ```

  - définir la variable d'environnement JAVA_HOME
    - cf. [doc cordova][set env vars]
- SDK Android
  - installer le SDK android
    - via les [cmdline tools][]
      - définir la variable d'environnement ANDROID_SDK_ROOT

      ```shell
      ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager --install "build-tools;32.0.0"  "platform-tools"  "platforms;android-32" "sources;android-32"
      ```

    - ou en installant Android Studio
      - [procédure][install Android studio]
      - [téléchargements][Android Studio downloads]
      - définir la variable d'environnement ANDROID_SDK_ROOT
   

[sdkman install]: https://sdkman.io/install
[set env vars]: https://cordova.apache.org/docs/en/11.x/guide/platforms/android/index.html#setting-environment-variables
[cmdline tools]: https://developer.android.com/studio?hl=fr#command-tools:~:text=Command%20line%20tools%20only
[install Android studio]: https://developer.android.com/studio/install?hl=frs
[Android Studio downloads]: https://developer.android.com/studio?hl=fr#command-tools:~:text=Android%20Studio%20downloads

#### Commandes usuelles

- installer les dépendances  

  ```shell
  pnpm install
  ```

- pour n'installer que les versions précisément définies dans le pnpm-lock.yml :

```shell
pnpm install --frozen-lockfile
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
  
### build Mac M1 
```
arch -x86_64  pnpm ionic cordova plugin add  onesignal-cordova-plugin
```

Avec Xcode 14.3, modifier les fichiers -frameworks.sh pour ajouter -f après les readlink 
source : https://developer.apple.com/forums/thread/725230

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
****- pour l'animation android : [Shape shifter][]
  - éditer [logo.shapeshifter][]
  - ou partir du [vector drawable][]
  - résultat : [Animated Vector Drawable][avd]

[iconKitchen icon]: https://icon.kitchen/i/H4sIAAAAAAAAA1WQwUrEMBCG32W8dmFtXaQ9ugcRFYTtTWSZNmkaNmlikipl2Xd3Jl1BL23zZeab6X%2BGLzSzjNCcQWA4taO0EpoUZllAp9rF0wlUQKHllKCAxAUCmgFNpJJB7Y32GBILoqQXCDngbLhW924igEIce2ctCy7ccrVqi0pSWacOI2YSP2cderPCvTMuELy52%2B7KWmT2%2BLsITev5%2FvZfQUYlo6qq7uuKEE6KfM2m3ubRb7SMnhT3J%2BeJl7sCglYjKfN351Jy9nowclg59frY6sQqeF0O7TOpfXwg0Z%2FxPj7lP17T8%2FEFFzdzJCNdDtrICTlcyuVol5hOnIZ1Yjac%2FzutKoLTLNIu0vNbdiw1uGxickHCx%2BUHTDmhga8BAAA%3D
[ic-logo-svg]: ./resources/ic-logo%20mySTK.svg
[Shape shifter]: https://shapeshifter.design/
[logo.shapeshifter]: ./logo.shapeshifter
[vector drawable]: ./logo.xml
[avd]: ./animated_logo.xml


### Distribution

#### Firebase App Distribution

```shell
pnpm run build:android:debug
```

Glisser déposer l'apk dans App Distribution/Releases
