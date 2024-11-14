import { RagChatbot } from "~/components/chatBot";

export const loader = async () => {
  return {
    apiKey: process.env.API_KEY,
  };
};

export default function Index() {
  return (
    <div className="flex items-center justify-center">
      <div>
        <RagChatbot />
      </div>
    </div>
  );
}
