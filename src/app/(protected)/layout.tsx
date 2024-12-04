import AgentsData from "../../components/templates/dashboard/components/AgentsData";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgentsData>{children}</AgentsData>;
}
