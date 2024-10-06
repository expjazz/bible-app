import { notFound } from "next/navigation";
import { prisma } from "~/server/db";

export default async function PdfPage({
  params,
}: {
  params: { pdfId: string };
}) {
  const pdfTemplate = await prisma.pdfTemplate.findUnique({
    where: {
      id: params.pdfId,
    },
  });
  if (!pdfTemplate) {
    return notFound();
  }
  console.log("this is a pdf template", pdfTemplate);
  return (
    <div dangerouslySetInnerHTML={{ __html: pdfTemplate?.content as string }} />
  );
}
