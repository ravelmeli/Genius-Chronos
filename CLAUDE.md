# Genius Chronos

Vidéos courtes (9:16, environ 85 s) de vulgarisation science et technologie, faites avec HyperFrames et three.js. Voir `phone-heat/` pour l'exemple de référence.

## Script (à livrer avant la voix)

Chaque script se termine par une invitation à laisser un commentaire et à s'abonner (par exemple une question liée au sujet, puis « abonne-toi pour comprendre l'objet suivant »). La vidéo reprend cette fin avec la bulle de question et les boutons COMMENTE / ABONNE-TOI.

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
