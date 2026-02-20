# 🎯 Test Setup - Team Onboarding Checklist

Use this checklist to onboard team members to the new test infrastructure.

## For Each Team Member

### ✅ Day 1: Get Set Up

- [ ] Clone/update the repository
- [ ] Run `pnpm install`
- [ ] Run `pnpm test` (verify it works)
- [ ] Run `pnpm test:watch` (keep it running in background)
- [ ] Read `TESTING_QUICKSTART.md` (5 minutes)

### ✅ Day 2: First Test

- [ ] Copy a test from `TEST_EXAMPLES.md`
- [ ] Modify it for your component
- [ ] Run `pnpm test:watch` and see it pass
- [ ] Commit your test
- [ ] Celebrate! 🎉

### ✅ Week 1: Learn & Practice

- [ ] Read `TESTING.md` (30 minutes)
- [ ] Write 3-5 tests for your components
- [ ] Try `pnpm test:ui` (interactive dashboard)
- [ ] Run `pnpm test:coverage` and review report
- [ ] Bookmark `QUICK_REFERENCE.md`

### ✅ Week 2+: Master It

- [ ] Write E2E tests for critical flows
- [ ] Achieve coverage targets for your code
- [ ] Review others' tests
- [ ] Help teammates with testing questions
- [ ] Share testing tips in team sync

---

## For Team Leads

### ✅ Setup Verification

- [ ] All test scripts in `package.json` ✓
- [ ] Vitest configs in all packages ✓
- [ ] Playwright config at root ✓
- [ ] `.github/workflows/test.yml` for CI/CD ✓
- [ ] Example tests passing ✓

### ✅ Team Communication

- [ ] Share `TESTING_QUICKSTART.md` with team
- [ ] Pin `QUICK_REFERENCE.md` in team docs
- [ ] Set coverage targets in `vitest.config.ts`
- [ ] Review coverage reports weekly
- [ ] Celebrate test milestones

### ✅ Process Integration

- [ ] Add test review to PR checklist
- [ ] Set required coverage % for merging
- [ ] Include tests in Definition of Done
- [ ] Monitor CI/CD test reports
- [ ] Celebrate test coverage increases

### ✅ Documentation

- [ ] Create team testing guidelines (optional)
- [ ] Add testing tips to team wiki
- [ ] Link to guides from main README
- [ ] Record walkthrough video (optional)
- [ ] Collect team questions for FAQ

---

## For Code Reviewers

### ✅ When Reviewing Tests

**Look for:**

- [ ] Test name clearly describes what's tested
- [ ] Tests use semantic queries (getByRole, getByLabelText)
- [ ] Each test checks one thing
- [ ] No test interdependencies
- [ ] No implementation details tested
- [ ] Proper mocking for external dependencies
- [ ] Good use of fixtures and mocks

**Example good test:**

```typescript
it('shows error when email is invalid', () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'invalid' }
  });
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

**Red flags:**

- ❌ Test names like "it works" or "test 1"
- ❌ Tests using `getByTestId` everywhere
- ❌ Multiple things tested in one test
- ❌ `wait()` without timeout
- ❌ Mocking things that don't need mocking

---

## Common Questions

### "When should I write tests?"

- ✅ New component → write tests
- ✅ Bug fix → write test for bug first
- ✅ Feature → write tests as you build
- ❌ Don't wait until "test day"

### "What should I test?"

- ✅ Critical user flows (login, checkout)
- ✅ Components that appear on many pages
- ✅ Complex logic/calculations
- ✅ Error states and edge cases
- ❌ Don't test third-party libraries
- ❌ Don't test framework internals

### "How much coverage do we need?"

- **Start with:** 40-60% (achievable)
- **Grow to:** 70-80% (good practices)
- **Exceed:** 80%+ (thorough testing)
- **Key:** Increase gradually, not all at once

### "Should I write unit or E2E tests?"

- **Unit tests:** Quick, isolated, lots of them
- **Component tests:** Behavior, React focus
- **E2E tests:** Critical user flows only

**Pyramid:**

```
    /\      ← Few E2E tests (critical flows)
   /  \
  /    \   ← Some integration tests
 /      \
/________\ ← Many unit/component tests
```

### "How do I debug a failing test?"

```bash
# Option 1: Watch mode
pnpm test:watch

# Option 2: Interactive UI
pnpm test:ui

# Option 3: Console output
# Add console.log() in test or component

# Option 4: Playwright inspector
pnpm exec playwright test --debug

# Option 5: Browser DevTools
# E2E tests open browser you can inspect
```

---

## Team Metrics (Optional)

Track these metrics to celebrate progress:

```
Week 1:     0 tests
Week 2:     50 tests    (+50)  ✅
Week 4:     150 tests   (+100) ✅
Week 8:     400 tests   (+250) ✅
Week 12:    800 tests   (+400) ✅✅✅
```

Example team message:

> 🎉 **Testing Milestone!** We've written 500 tests this month.
> Coverage went from 20% to 45%. Great work team!

---

## Office Hours / Help

### Scheduling

**Option 1: Weekly Testing Office Hours**

```
Every Tuesday, 2-3pm
- Ask questions
- Pair on tests
- Share tips
```

**Option 2: Async Q&A**

```
- Slack channel: #testing-help
- GitHub discussions
- Comment on test PRs
```

### Common Help Topics

1. **"My test is failing"**
   - Share error message
   - Show test code
   - Show component being tested
   - Try `pnpm test:ui` to debug

2. **"How do I test this?"**
   - Find similar in `TEST_EXAMPLES.md`
   - Check `TESTING.md` for pattern
   - Ask in #testing-help

3. **"Coverage too low"**
   - Review report: `pnpm test:coverage`
   - Find untested code
   - Write tests for critical paths
   - Ask for pairing session

---

## Success Criteria

**Week 1:**

- [ ] All devs can run tests locally ✓
- [ ] All devs read TESTING_QUICKSTART.md ✓
- [ ] At least one test written ✓

**Week 2:**

- [ ] New tests in every PR ✓
- [ ] Team familiar with test patterns ✓
- [ ] CI/CD tests passing ✓

**Month 1:**

- [ ] 50+ tests written ✓
- [ ] Coverage 30%+ ✓
- [ ] All PRs include tests ✓
- [ ] Zero test flakiness ✓

**Month 3:**

- [ ] 200+ tests ✓
- [ ] Coverage 50%+ ✓
- [ ] E2E tests for critical flows ✓
- [ ] Testing part of Definition of Done ✓

---

## Resources Reference

| Resource    | Link                          | Purpose                 |
| ----------- | ----------------------------- | ----------------------- |
| Quick Start | `TESTING_QUICKSTART.md`       | 5-minute onboarding     |
| Full Guide  | `TESTING.md`                  | Complete reference      |
| Examples    | `TEST_EXAMPLES.md`            | Copy-paste patterns     |
| Commands    | `QUICK_REFERENCE.md`          | Command lookup          |
| Navigation  | `TEST_DOCUMENTATION_INDEX.md` | Find what you need      |
| Setup       | `TEST_SETUP_VERIFICATION.md`  | Verify everything works |

---

## Tool Shortcuts (Optional)

Add to your shell config (`.bashrc`, `.zshrc`):

```bash
# Test commands
alias test="pnpm test"
alias testw="pnpm test:watch"
alias testui="pnpm test:ui"
alias testcov="pnpm test:coverage"
alias teste2e="pnpm test:e2e"

# Open coverage report
alias covreport="pnpm test:coverage && open coverage/index.html"
```

---

## Celebration Moments

🎉 **Celebrate:**

- ✅ First test written
- ✅ 50 tests milestone
- ✅ Coverage above 30%
- ✅ E2E tests passing
- ✅ All PRs have tests
- ✅ Zero test flakes in a week
- ✅ Team proficiency achieved

---

## Feedback & Iteration

### Monthly Check-in Questions

1. **What's working well?**
2. **What's frustrating?**
3. **What docs are missing?**
4. **What patterns aren't clear?**
5. **How can we improve testing?**

Use feedback to:

- Improve documentation
- Adjust coverage targets
- Refine testing guidelines
- Share solutions widely

---

## Additional Resources

### External Learning

- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [React Testing Library](https://testing-library.com)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Team Documentation

- Create internal testing guidelines
- Share testing patterns specific to your app
- Document component testing conventions
- Record video walkthroughs

---

## Go-Live Checklist

Before considering testing "done":

### ✅ Infrastructure

- [ ] All tools installed and working
- [ ] All example tests passing
- [ ] CI/CD pipeline running
- [ ] Coverage reporting active

### ✅ Team Knowledge

- [ ] All devs can run tests
- [ ] All devs know where guides are
- [ ] All devs wrote at least one test
- [ ] Help channels established

### ✅ Process

- [ ] Tests in Definition of Done
- [ ] PR review includes test review
- [ ] Coverage targets set
- [ ] CI/CD blocks merging on test failure

### ✅ Documentation

- [ ] All 8 guides accessible
- [ ] Quick reference bookmarked
- [ ] Links in main README
- [ ] Team aware of resources

---

## 🎉 You're Ready!

Once all checkboxes are ✅, your team is ready to write tests confidently.

**Happy testing!** 🚀

---

## Team Contact

**Testing Lead:** [Your name]  
**Slack Channel:** #testing-help  
**Office Hours:** [Day/Time]  
**Questions:** [Contact method]

Remember: Good tests make great code! 🧪✨
