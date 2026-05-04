// Example usage of the TopBar component
// Notifications are now self-fetched inside TopBar via useSession + useAppService.
// No notification prop is needed.

import TopBar from '.';

export function ExampleLayout() {
  return (
    <div>
      <TopBar
        adminName="Kingsley Ifijeh"
        adminEmail="kingsley@example.com"
        adminRole="System Administrator"
        adminAvatar="https://github.com/shadcn.png"
      />
    </div>
  );
}

export function ExampleLayoutMinimal() {
  return (
    <div>
      <TopBar adminName="John Admin" />
    </div>
  );
}
