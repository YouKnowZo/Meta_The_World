# Contributing to Meta The World

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Repository Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YouKnowZo/Meta_The_World.git
   cd Meta_The_World
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Branch Structure

- `main` - Development branch
- `master` - Production/stable branch with full project structure

## Development Workflow

### Working with Branches

The repository has two main branches:

- **master**: Contains the complete project structure with all apps, packages, and configurations
- **main**: Initial development branch

To work on the master branch:

```bash
# Fetch all branches
git fetch origin

# Switch to master branch
git checkout master

# Your branch should now track origin/master
git status
```

### Making Changes

1. Create a feature branch from master:
   ```bash
   git checkout master
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your feature branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Pushing to Master

If you need to push directly to master (with proper permissions):

```bash
git checkout master
# Make your changes
git add .
git commit -m "Your commit message"
git push -u origin master
```

The `-u` flag sets up tracking between your local master branch and origin/master.

## Environment Variables

For smart contract development, you may need to set up environment variables:

Create a `.env` file in `packages/nft/`:

```
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_api_key_here
```

**Note**: Never commit the `.env` file to the repository.

## Running the Project

### Web Application
```bash
cd apps/web
npm install --legacy-peer-deps
npm run dev
```

### Smart Contracts
```bash
cd packages/nft
npm install --legacy-peer-deps
npm run compile
npm run test
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch from master
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request to the master branch

## Questions?

For questions or support, please open an issue on GitHub.
