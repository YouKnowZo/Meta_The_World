# Contributing to Meta The World

Thank you for your interest in contributing to Meta The World! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setting Up Your Development Environment

1. **Fork and Clone the Repository**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/Meta_The_World.git
   cd Meta_The_World
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Remote**
   ```bash
   # Add upstream remote
   git remote add upstream https://github.com/YouKnowZo/Meta_The_World.git
   ```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
# Update your local repository
git fetch upstream
git checkout main
git merge upstream/main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure your code follows the project's coding standards
4. Test your changes thoroughly

### Committing Changes

Write clear, concise commit messages:

```bash
git add .
git commit -m "Add feature: description of your changes"
```

### Pushing Changes

Push your feature branch to your fork:

```bash
# Push to your fork
git push origin feature/your-feature-name
```

**Note:** Do not push directly to the master or main branch. Always use feature branches and create pull requests.

### Creating a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill in the pull request template with:
   - Description of changes
   - Related issues
   - Screenshots (if applicable)
5. Submit the pull request

## Branch Strategy

- `main` - Main development branch
- `master` - Production-ready code
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes for production

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

Before submitting a pull request:

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build the project
npm run build
```

## Need Help?

- Check existing issues and pull requests
- Join our Discord community
- Email support@metatheworld.com

## Code of Conduct

Please note that this project follows a Code of Conduct. By participating, you are expected to uphold this code.

Thank you for contributing! 🌍✨
