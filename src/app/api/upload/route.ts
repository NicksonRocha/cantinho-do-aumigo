import cloudinary from "../../../../lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("file") as File[]; 
    if (!files.length) {
      return Response.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    const uploads = await Promise.all(
      files.slice(0, 4).map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "cantinho-aumigo/pets", resource_type: "image" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
          );
          stream.end(buffer);
        });

        return result;
      })
    );

    if (uploads.length === 1) {
      return Response.json(uploads[0], { status: 200 });
    }
    return Response.json({ files: uploads }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Falha no upload" }, { status: 500 });
  }
}
