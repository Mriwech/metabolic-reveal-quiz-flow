
# Mitolyn Quiz Application

Une application de quiz métabolique interactive construite avec React et Supabase qui génère des rapports personnalisés de santé métabolique.

## Stack Technologique

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Edge Functions, Authentication)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Email Service**: SendGrid
- **Notifications**: Sonner
- **Build Tool**: Vite

## Fonctionnalités

- Quiz interactif en 10 étapes sur la santé métabolique
- Calcul dynamique de l'âge métabolique
- Envoi automatique de rapports par email
- Suivi des sessions utilisateur et analytics
- Interface responsive et accessible
- Intégration ClickBank pour les conversions

## Installation et Développement Local

### Prérequis

- Node.js >= 18.0.0
- npm ou yarn
- Compte Supabase
- Clé API SendGrid

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd mitolyn-quiz
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Configurer Supabase**
- Créer un projet sur [Supabase](https://supabase.com)
- Exécuter les migrations SQL dans `supabase/migrations/`
- Configurer les secrets dans le dashboard Supabase

5. **Lancer en mode développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173/`

## Déploiement en Production

### Via Lovable (Recommandé)

1. Ouvrir le projet dans Lovable
2. Cliquer sur "Publish" dans l'interface
3. Configurer le domaine personnalisé si nécessaire

### Déploiement Manuel

1. **Build de production**
```bash
npm run build
```

2. **Déployer les fichiers statiques**
```bash
# Utiliser votre service de déploiement préféré
# (Vercel, Netlify, etc.)
```

3. **Déployer les Edge Functions Supabase**
```bash
supabase functions deploy
```

## Variables d'Environnement

### Secrets Supabase (configurés via le dashboard)

- `SENDGRID_API_KEY` - Clé API SendGrid pour l'envoi d'emails
- `SENDGRID_SENDER_EMAIL` - Email expéditeur vérifié SendGrid
- `BASE_REDIRECT_URL` - URL de base pour les redirections ClickBank

### Variables Frontend (automatiquement injectées)

- `VITE_SUPABASE_URL` - URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé publique Supabase

## Structure du Projet

```
src/
├── components/          # Composants React
│   ├── questions/      # Composants de questions du quiz
│   ├── results/        # Composants de résultats
│   └── ui/            # Composants UI réutilisables
├── context/           # Contextes React
├── hooks/             # Hooks personnalisés
├── lib/               # Utilitaires et configuration
├── pages/             # Pages principales
├── utils/             # Fonctions utilitaires
└── integrations/      # Intégrations externes (Supabase)

supabase/
├── functions/         # Edge Functions
└── migrations/        # Migrations de base de données
```

## APIs et Intégrations

### SendGrid
Configuration requise pour l'envoi d'emails de confirmation.

### Supabase
- **Database**: Stockage des soumissions de quiz
- **Edge Functions**: Logique serveur pour l'envoi d'emails
- **Analytics**: Suivi des sessions utilisateur

### ClickBank
Intégration pour le suivi des conversions via paramètres UTM.

## Développement

### Scripts Disponibles

```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Linting du code
```

### Tests

Pour tester l'envoi d'emails en local, utiliser l'environnement de développement Supabase.

## Support

Pour toute question technique, consulter :
- [Documentation Lovable](https://docs.lovable.dev/)
- [Documentation Supabase](https://supabase.com/docs)
- [Community Discord Lovable](https://discord.com/channels/1119885301872070706/1280461670979993613)
