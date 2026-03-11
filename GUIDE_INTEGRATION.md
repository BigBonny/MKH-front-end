# Guide d'Intégration - Clerk, Stripe & Supabase

Ce guide explique comment configurer et intégrer Clerk (authentification), Stripe (paiements) et Supabase (base de données) avec votre site MKH.

---

## 📋 Table des matières

1. [Configuration de Clerk](#1-configuration-de-clerk)
2. [Configuration de Supabase](#2-configuration-de-supabase)
3. [Configuration de Stripe](#3-configuration-de-stripe)
4. [Déploiement sur Netlify](#4-déploiement-sur-netlify)
5. [Tests](#5-tests)

---

## 1. Configuration de Clerk

### 1.1 Créer un compte Clerk

1. Allez sur [clerk.com](https://clerk.com)
2. Créez un compte gratuit
3. Créez une nouvelle application

### 1.2 Récupérer les clés API

Dans le dashboard Clerk :
- **Publishable Key** : `pk_test_...`
- **Secret Key** : `sk_test_...`

### 1.3 Configurer les URLs

Dans Clerk Dashboard > Configure > URLs :
- **Sign-in URL** : `/sign-in`
- **Sign-up URL** : `/sign-up`
- **After sign-in URL** : `/account`
- **After sign-up URL** : `/account`

### 1.4 Activer les fournisseurs OAuth (optionnel)

Dans Clerk Dashboard > User & Authentication > Social Connections :
- Google
- Facebook
- GitHub
- etc.

---

## 2. Configuration de Supabase

### 2.1 Créer un projet

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte
3. Créez un nouveau projet

### 2.2 Récupérer les clés API

Dans le dashboard Supabase > Project Settings > API :
- **URL** : `https://your-project.supabase.co`
- **Anon Key** : `eyJhbG...`
- **Service Role Key** : `eyJhbG...` (dans la section Project Settings > Data API)

### 2.3 Créer les tables

1. Allez dans l'**SQL Editor**
2. Créez une **New query**
3. Copiez-collez le contenu du fichier `supabase/schema.sql`
4. Cliquez sur **Run**

### 2.4 Configurer RLS (Row Level Security)

Le schéma SQL inclut déjà les politiques RLS. Vérifiez dans :
- Database > Tables > [chaque table] > Policies

---

## 3. Configuration de Stripe

### 3.1 Créer un compte Stripe

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte
3. Activez le mode test

### 3.2 Récupérer les clés API

Dans le dashboard Stripe > Developers > API Keys :
- **Publishable Key** : `pk_test_...`
- **Secret Key** : `sk_test_...`

### 3.3 Créer les produits (optionnel)

Pour les abonnements, créez des produits dans :
- Stripe Dashboard > Products > Add Product

Exemple de configuration :
- **Basic** : 49€/mois
- **Premium** : 99€/mois
- **VIP** : 199€/mois

Notez les **Price IDs** (format : `price_...`)

### 3.4 Configurer le Webhook

1. Dans Stripe Dashboard > Developers > Webhooks
2. Cliquez sur **Add endpoint**
3. URL : `https://votre-site.netlify.app/.netlify/functions/stripe-webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.deleted`

5. Copiez le **Webhook Secret** (format : `whsec_...`)

---

## 4. Déploiement sur Netlify

### 4.1 Créer le fichier .env

Créez un fichier `.env` à la racine du projet :

```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
VITE_APP_URL=https://votre-site.netlify.app
```

### 4.2 Déployer sur Netlify

#### Option A : Via Git

1. Poussez votre code sur GitHub/GitLab
2. Connectez Netlify à votre repo
3. Configurez les variables d'environnement dans :
   - Site Settings > Environment Variables

#### Option B : Déploiement manuel

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

### 4.3 Configurer les variables d'environnement sur Netlify

Dans Netlify Dashboard > Site Settings > Environment Variables :

| Variable | Valeur |
|----------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` |
| `VITE_SUPABASE_URL` | `https://...` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `VITE_APP_URL` | `https://...` |
| `CLERK_SECRET_KEY` | `sk_test_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |

**Important** : Les variables côté serveur (sans `VITE_`) doivent être configurées pour les fonctions Netlify.

---

## 5. Tests

### 5.1 Tester Clerk

1. Allez sur `/sign-in`
2. Créez un compte test
3. Vérifiez que l'utilisateur apparaît dans Supabase

### 5.2 Tester le Store

1. Ajoutez des produits au panier
2. Cliquez sur "Commander"
3. Vérifiez la redirection vers Stripe Checkout

### 5.3 Tester Stripe

Utilisez ces cartes de test :

| Numéro | Résultat |
|--------|----------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 9995` | Paiement refusé |
| `4000 0000 0000 3220` | 3D Secure requis |

- Date : n'importe quelle date future
- CVC : n'importe quel code à 3 chiffres

### 5.4 Tester le Webhook

1. Dans Stripe Dashboard > Developers > Webhooks
2. Cliquez sur votre endpoint
3. Cliquez sur **Send test event**
4. Sélectionnez `checkout.session.completed`
5. Vérifiez que la commande apparaît dans Supabase

---

## 🔧 Dépannage

### Erreur "Clerk key not found"

Vérifiez que `VITE_CLERK_PUBLISHABLE_KEY` est bien défini dans les variables d'environnement.

### Erreur "Supabase connection failed"

Vérifiez :
- L'URL Supabase
- La clé Anon
- Que le projet est actif

### Erreur "Stripe checkout failed"

Vérifiez :
- La clé Publishable côté client
- La clé Secret côté serveur
- Les logs des fonctions Netlify

### Le webhook ne fonctionne pas

Vérifiez :
- L'URL du webhook
- Le secret du webhook
- Les logs des fonctions Netlify

---

## 📚 Ressources

- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## 📝 Notes importantes

### Sécurité

- Ne jamais committer le fichier `.env`
- Utilisez toujours les clés **test** en développement
- Les clés **Service Role** de Supabase ne doivent jamais être exposées côté client

### Production

Avant de passer en production :

1. Passez Clerk en mode production
2. Passez Stripe en mode live
3. Mettez à jour les URLs dans Clerk et Stripe
4. Créez de vrais produits dans Stripe
5. Testez tous les flux de paiement

### Coûts

| Service | Gratuit | Payant |
|---------|---------|--------|
| Clerk | 10 000 users/mois | À partir de $25/mois |
| Supabase | 500 MB, 2M requêtes | À partir de $25/mois |
| Stripe | 2.9% + 30¢ par transaction | Même tarif |
| Netlify | 125K fonctions/mois | À partir de $19/mois |
