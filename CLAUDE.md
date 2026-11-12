# Genius Chronos

Vidéos courtes (9:16, environ 85 s) de vulgarisation science et technologie, faites avec HyperFrames et three.js. Voir `phone-heat/` pour l'exemple de référence.

## Script (à livrer avant la voix)

Chaque script se termine par une invitation à laisser un commentaire et à s'abonner (par exemple une question liée au sujet, puis « abonne-toi pour comprendre l'objet suivant »). La vidéo reprend cette fin avec la bulle de question et les boutons COMMENTE / ABONNE-TOI.

## Voix off (générée par l'utilisateur)

- L'utilisateur génère la voix lui-même (voix Koda, style Promote dans AI Studio). Ne génère plus la voix via l'API Google et n'utilise plus de clé API.
- Après le script, donne-lui le texte brut à copier-coller dans le générateur de voix, avec le plan visuel et la liste « à vérifier ». Puis attends son WAV.
- Quand il envoie le WAV : transcris-le en local avec faster-whisper (mots horodatés), corrige les mots mal transcrits d'après le script, puis enchaîne sur le montage et le rendu.
- Dans `publication.md`, la voix est « Koda, style Promote ».

## Lots de 4 vidéos

- L'utilisateur donne désormais 4 sujets à la fois. Livre les 4 scripts d'un coup (texte brut pour la voix, plan visuel, liste « à vérifier » pour chacun), puis attends ses 4 WAV.
- Il génère les voix lui-même dans Google AI Studio. Quand il envoie un WAV, monte et rends cette vidéo (tu peux traiter les WAV dans l'ordre où ils arrivent).

## Sous-titres

- Les sous-titres sont plus bas qu'avant, à `top: 1430px` (sur 1920). Demande de l'utilisateur : il les veut à cet endroit sur toutes les prochaines vidéos.
- Génère-les avec `templates/gen_captions.py <durée>` depuis le dossier de la vidéo. La position est la constante `CAPTION_TOP`.
- Les puces de texte restent dans les zones haute (290 à 520 px) et basse (1010 à 1160 px), sans toucher aux sous-titres.

## Texte de publication (à livrer avec chaque vidéo)

Pour chaque nouvelle vidéo, génère toujours, au complet et dans cet ordre, en suivant `templates/publication-template.md` :

1. le titre
2. 5 titres alternatifs
3. la description (structure optimisée YouTube : mot-clé en première ligne, 3 puces, question, appel à s'abonner, hashtags)
4. les tags
5. 5 légendes TikTok

Règles :
- Écris en français, au tutoiement, comme dans `phone-heat/publication.md`.
- N'utilise que des faits présents dans le script de la vidéo. N'invente aucun chiffre. Marque comme exemples les valeurs d'illustration.
- La voix n'est pas connue : demande son nom, ou écris « (à compléter) ».
- Enregistre le résultat dans `<dossier-de-la-vidéo>/publication.md`, puis colle aussi le texte dans la réponse pour pouvoir le copier.
