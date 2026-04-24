# Resources Module — Accessibility Audit

_WCAG 2.1 AA compliance checklist and known accessibility requirements._

## Target Standard

WCAG 2.1 Level AA

## Component Checklist

### ResourcesView (Page)

- [ ] Page has a meaningful `<h1>` ("Resources")
- [ ] Tab list uses correct ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- [ ] Active tab indicated with `aria-selected="true"`
- [ ] Tab panels have `aria-labelledby` pointing to their tab

### FolderCard

- [ ] Card is focusable and activatable via keyboard (Enter/Space navigates into folder)
- [ ] Action menu button has `aria-label="Folder actions for <name>"`
- [ ] Action menu uses `role="menu"` / `role="menuitem"` pattern
- [ ] Destructive "Delete" item has `aria-label` that includes the folder name

### FileCard

- [ ] Download button has `aria-label="Download <file name>"`
- [ ] File type icon has `aria-hidden="true"` (decorative)

### CreateFolderModal

- [ ] Modal uses `role="dialog"` with `aria-labelledby` on the heading
- [ ] Focus is trapped within the modal while open
- [ ] Closing the modal returns focus to the trigger button
- [ ] Validation error messages are linked to the input via `aria-describedby`

### UploadFileDropzone

- [ ] Dropzone has `role="region"` and `aria-label="File upload area"`
- [ ] Drag-active state communicated via `aria-live="polite"` announcement
- [ ] Upload progress communicated via `aria-live="polite"`
- [ ] File input has a visible or SR-only label

## Automated Audit Tool

Run axe-core during E2E tests:

```ts
import { checkA11y } from 'axe-playwright';
await checkA11y(page, '#resources-page', {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
});
```

## Known Issues

None currently recorded. Add any discovered violations here with ticket references.
