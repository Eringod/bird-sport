// Cloudflare Pages Function
// 处理 GET /api/records 和 POST /api/records

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT * FROM records ORDER BY time DESC LIMIT 100`
    ).all();

    return Response.json({ records: results });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { memberId, sport, duration, pts, note } = body;

    if (!memberId || !sport || !duration || !pts) {
      return Response.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const time = Date.now();
    await env.DB.prepare(
      `INSERT INTO records (memberId, sport, duration, pts, note, time) VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(memberId, sport, duration, pts, note || '', time).run();

    return Response.json({ success: true, time });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
