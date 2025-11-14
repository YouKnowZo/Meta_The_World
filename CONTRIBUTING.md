# 🤝 Contributing to MetaWorld

Thank you for your interest in contributing to MetaWorld! This virtual world is built by dreamers like you.

## 🌟 Ways to Contribute

### 1. Code Contributions
- Add new features
- Fix bugs
- Improve performance
- Enhance UI/UX
- Write tests

### 2. Content Creation
- Design new property types
- Create building models
- Design UI themes
- Write documentation

### 3. Ideas & Feedback
- Suggest features
- Report bugs
- Share user experience
- Propose improvements

### 4. Documentation
- Improve README
- Write tutorials
- Create video guides
- Translate to other languages

## 🚀 Getting Started

### Setup Development Environment

1. **Fork the repository**
2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/metaworld.git
cd metaworld
```

3. **Install dependencies**
```bash
npm install
```

4. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

5. **Make your changes**
6. **Test thoroughly**
7. **Commit with clear messages**
```bash
git commit -m "Add: New feature description"
```

8. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

9. **Create a Pull Request**

## 📝 Coding Standards

### JavaScript Style
- Use ES6+ features
- Clear, descriptive variable names
- Comment complex logic
- Keep functions small and focused
- Use async/await for promises

### Code Organization
```
/workspace/
  ├── index.html          # Main UI
  ├── app.js             # Application logic
  ├── world-engine.js    # 3D rendering
  ├── social.js          # Social features
  ├── server.js          # Backend server
  └── ...
```

### Naming Conventions
- Files: `kebab-case.js`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_privateMethod`

### Comments
```javascript
// Good: Explains WHY
// Calculate commission to reduce net cost for realtors
const commission = price * this.commissionRate;

// Bad: Explains WHAT (code is self-explanatory)
// Set commission equal to price times commission rate
const commission = price * this.commissionRate;
```

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Try latest version
- Collect error messages
- Note steps to reproduce

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
What alternatives have you thought about?

**Additional Context**
Mockups, examples, references.
```

## 🎨 Adding New Features

### Example: Adding a New Property Type

1. **Edit `world-engine.js`**
```javascript
const propertyTypes = [
    // ... existing types
    {
        name: 'Your New Type',
        basePrice: 500000,
        height: 50,
        color: 0x2563eb
    }
];
```

2. **Add unique features**
```javascript
generateFeatures(typeName, price) {
    // ... existing logic
    if (typeName.includes('Your New Type')) {
        features.push('Special Feature');
    }
}
```

3. **Test thoroughly**
4. **Update documentation**
5. **Submit PR**

### Example: Adding a New Profession

1. **Edit `index.html` dropdown**
```html
<option value="yourprofession">Your Profession</option>
```

2. **Edit `app.js` profession logic**
```javascript
const professionNames = {
    // ... existing
    'yourprofession': 'Your Profession Name'
};
```

3. **Add profession-specific features**
4. **Test and document**
5. **Submit PR**

## 🧪 Testing

### Manual Testing Checklist
- [ ] Feature works as intended
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Works in Chrome, Firefox, Safari
- [ ] No performance regression
- [ ] UI looks good
- [ ] Documentation updated

### Test Your Changes
```bash
# Start server
npm start

# Test in browser
open http://localhost:3000

# Test different scenarios
# - Different screen sizes
# - Different browsers
# - Edge cases
```

## 📚 Documentation

When adding features, update:
- README.md (if major feature)
- FEATURES.md (add to appropriate section)
- QUICKSTART.md (if affects onboarding)
- Code comments
- Commit messages

## 🔄 Pull Request Process

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Testing completed
- [ ] PR description is clear

### PR Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested thoroughly
```

## 🎯 Priority Areas

Current focus areas:
1. **Performance optimization**
2. **Mobile responsiveness**
3. **Property selling mechanics**
4. **Interior views**
5. **Enhanced multiplayer**

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in README
- Given special role in community

## 💬 Community

- **Questions?** Open a discussion
- **Ideas?** Share in issues
- **Help?** Tag maintainers
- **Chat?** Join our community (link TBD)

## 📋 Code Review Process

### What We Look For
✅ Clear, readable code
✅ Proper error handling
✅ Good performance
✅ Security considerations
✅ User experience
✅ Documentation

### Review Timeline
- Small PRs: 1-2 days
- Medium PRs: 3-5 days
- Large PRs: 1-2 weeks

## 🚫 What to Avoid

❌ Massive PRs (split into smaller ones)
❌ Unrelated changes in one PR
❌ Breaking changes without discussion
❌ Code without comments
❌ Features without documentation
❌ Untested code

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, makes MetaWorld better for everyone. Thank you for being part of this journey to create a virtual world where everyone can be who they want to be!

---

**Questions?** Feel free to ask in issues or discussions.

**Happy Contributing!** 🚀
