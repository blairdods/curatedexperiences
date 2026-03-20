import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    // Mode 1: Generate embedding for raw text (used for query-time RAG)
    if (body.text) {
      const embedding = await model.run(body.text, {
        mean_pool: true,
        normalize: true,
      });

      return new Response(
        JSON.stringify({ embedding: Array.from(embedding) }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Mode 2: Embed records by IDs (used for content ingestion)
    const { ids, table = "content" } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "ids array or text required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const validTables = ["content", "tours"];
    if (!validTables.includes(table)) {
      return new Response(JSON.stringify({ error: "Invalid table" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch records
    let query;
    if (table === "content") {
      query = supabase.from(table).select("id, title, body, type").in("id", ids);
    } else {
      query = supabase
        .from(table)
        .select("id, title, tagline, highlights, regions, experience_tags")
        .in("id", ids);
    }

    const { data: records, error: fetchError } = await query;

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let embedded = 0;
    let failed = 0;

    for (const record of records || []) {
      let text: string;

      if (table === "content") {
        text = [record.type ? `[${record.type}]` : "", record.title, record.body]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 2000);
      } else {
        text = [
          record.title,
          record.tagline,
          record.highlights?.join(". "),
          record.regions?.join(", "),
          record.experience_tags?.join(", "),
        ]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 2000);
      }

      try {
        const embedding = await model.run(text, {
          mean_pool: true,
          normalize: true,
        });

        const { error: updateError } = await supabase
          .from(table)
          .update({ embedding: JSON.stringify(embedding) })
          .eq("id", record.id);

        if (updateError) {
          console.error(`Update failed for ${record.id}: ${updateError.message}`);
          failed++;
        } else {
          embedded++;
        }
      } catch (err) {
        console.error(`Embedding failed for ${record.id}: ${err.message}`);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ embedded, failed, total: records?.length || 0 }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
