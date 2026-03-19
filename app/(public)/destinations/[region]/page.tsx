export default async function DestinationPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  return <div>Destination: {region}</div>;
}
