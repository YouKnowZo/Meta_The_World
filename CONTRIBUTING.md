# 🤝 Contributing to Meta The World

First off, thank you for considering contributing to Meta The World! It's people like you that make this metaverse truly amazing.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect differing viewpoints

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version, etc.)

Example:
```markdown
**Bug**: Land NFT minting fails on mobile

**Steps to reproduce**:
1. Open app on mobile browser
2. Connect MetaMask
3. Try to mint land
4. Transaction fails

**Expected**: Transaction should succeed
**Actual**: Error "Insufficient gas"

**Environment**: iOS 15, Safari, MetaMask Mobile
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** (why is this needed?)
- **Proposed solution**
- **Alternative solutions** (if any)
- **Mockups** (if applicable)

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the coding style (see below)
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add: Amazing feature that does X"
   ```
   
   Use conventional commits:
   - `Add:` - New features
   - `Fix:` - Bug fixes
   - `Update:` - Updates to existing features
   - `Refactor:` - Code refactoring
   - `Docs:` - Documentation changes
   - `Test:` - Adding or updating tests

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Add screenshots for UI changes

## Development Setup

### Prerequisites
- Node.js 18+
- Git
- MetaMask or Web3 wallet
- MongoDB (optional)

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/meta-the-world.git
   cd meta-the-world
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## Coding Style

### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- Descriptive variable names
- Comments for complex logic

```javascript
// Good
const handleWalletConnection = async () => {
  try {
    const address = await connectWallet();
    setUserWallet(address);
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};

// Bad
const f = async () => {
  const a = await c();
  s(a);
};
```

### Solidity
- Follow Solidity style guide
- Use OpenZeppelin contracts when possible
- Add NatSpec comments
- Optimize for gas

```solidity
// Good
/**
 * @dev Mint a new land parcel
 * @param x X coordinate
 * @param y Y coordinate
 * @param z Z coordinate
 */
function mintLand(int256 x, int256 y, int256 z) public payable {
  require(msg.value >= basePrice, "Insufficient payment");
  // ...
}
```

### File Organization
```
src/
├── components/       # React components
│   ├── World/       # 3D world components
│   ├── UI/          # UI components
│   └── ...
├── utils/           # Utility functions
├── store/           # State management
└── hooks/           # Custom hooks
```

## Testing

### Frontend Tests
```bash
cd client
npm test
```

### Contract Tests
```bash
cd contracts
npx hardhat test
```

### Before Submitting
- [ ] Tests pass
- [ ] Linter passes
- [ ] No console errors
- [ ] Documentation updated
- [ ] Screenshots added (for UI changes)

## Areas Needing Help

We especially welcome contributions in:

🎨 **UI/UX Design**
- Improve user interface
- Create new themes
- Design avatar customization system

🏗️ **3D Modeling**
- Create building models
- Design avatar models
- Optimize 3D assets

⚙️ **Backend Development**
- Optimize API endpoints
- Improve multiplayer sync
- Add caching layer

🔐 **Smart Contracts**
- Gas optimization
- Additional features
- Security audits

📱 **Mobile**
- Mobile-responsive design
- Touch controls
- Mobile VR support

📚 **Documentation**
- Improve existing docs
- Create tutorials
- Translate documentation

🧪 **Testing**
- Write unit tests
- Integration tests
- Load testing

## Community

Join our community to discuss contributions:

- 💬 Discord: [Join server](https://discord.gg/metaworld)
- 🐦 Twitter: [@MetaTheWorld](https://twitter.com/metaworld)
- 📧 Email: dev@metaworld.com

## Recognition

Contributors are recognized in:
- README.md contributors section
- Special in-world commemorative NFT
- Discord contributor role

## Questions?

Don't hesitate to ask! You can:
- Open an issue with the `question` label
- Ask in Discord #development channel
- Email the maintainers

Thank you for contributing to Meta The World! 🌍✨