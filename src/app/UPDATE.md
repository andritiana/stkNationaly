npx ionic cordova build android --prod --release
~/App/android-sdk/build-tools/33.0.0/zipalign -p -f -v 4 platforms/android/app/build/outputs/bundle/release/app-release.aab platforms/android/app/build/outputs/bundle/release/mystk-v5.1.0-rc.2-unsigned.aab
jarsigner -keystore ./stk-national.keystore ./platforms/android/app/build/outputs/bundle/release/mystk-v5.1.0-rc.2-unsigned.aab stk_national

# Upgrade

pnpm ng update --allow-dirty @angular/core@12 @angular/cli@12
<!-- erreur -->
pnpm ng update --allow-dirty @angular/core@12 --migrate-only --from=11 --to=12

# Cordova plugins

https://github.com/chemerisuk/cordova-plugin-firebase-analytics#installation

https://documentation.onesignal.com/docs/step-by-step-cordova-2x-to-300-upgrade-guide