import { useMetaAccounts } from "@/api";

function ChannelListDialog() {
  const channelsQuery = useMetaAccounts("meta");

  return (
    <div className="p-4">
      {JSON.stringify(channelsQuery.data)}
      <h2 className="text-lg font-semibold mb-4">Channel List</h2>
      <p>This is a placeholder for the channel list dialog.</p>
    </div>
  );
}

export default ChannelListDialog;
