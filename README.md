# Présentation

Pour réaliser ce projet, j'ai utilisé  NodeJs et le framework ExpressJs avec Typescript.

Dans le fichier authServices.ts, vous pouvez appeler la fonction fetch avec trois paramètres le path, options et un validator. La fonction fetch effectue une requête HTTP et utilise le validateur pour valider les données retournées par la requête.

# Pré-requis

Node version >= 18

## Instalation
Installation des dépendances du projet:

```
npm install
```

## Utilisation
### Lancement

Le server express est lancé sur le port 3000 uniquement:

```
npm run start
```

### Tests
Les tests sur ce projet ont été réalisés avec Jest et SuperTest dans une configuration par défaut.

Pour éxecuter les tests:
```
npm run test
```