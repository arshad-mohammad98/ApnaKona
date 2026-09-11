import { redirect } from "next/navigation";

export default async function ListingRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/hostels/${id}`);
}
