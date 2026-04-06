import * as Tabs from "@radix-ui/react-tabs";

const MyTabs = () => {
  return (
    <Tabs.Root className="w-full" defaultValue="all">
      <Tabs.List className="flex border-b">
        <Tabs.Trigger
          value="all"
          className="px-4 py-2 text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500"
        >
          All
        </Tabs.Trigger>
        <Tabs.Trigger
          value="events"
          className="px-4 py-2 text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500"
        >
          Events
        </Tabs.Trigger>
        <Tabs.Trigger
          value="achievements"
          className="px-4 py-2 text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500"
        >
          Achievements
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="all">
        <p className="p-4">All Announcements</p>
      </Tabs.Content>
      <Tabs.Content value="events">
        <p className="p-4">Events List</p>
      </Tabs.Content>
      <Tabs.Content value="achievements">
        <p className="p-4">Achievements List</p>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default MyTabs;
