import { query } from "../config/dataconfig.js"

export const guardarLink = async (alias, linkOriginal) => {
    const { rows } = await query("INSERT INTO links (alias, original_url) VALUES ($1, $2) RETURNING *", [alias, linkOriginal]);
    return rows[0] || false;
}

export const extraerLinks = async (limit = 10, offset = 0) => {
    const { rows } = await query(
        "SELECT * FROM links ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
    return rows;
}

export const extraerLink = async (alias) => {
    const { rows } = await query("SELECT * FROM links WHERE alias = $1", [alias]);
    return rows[0] || false;
}

export const repoEliminarLink = async (alias) => {
    const { rows } = await query("DELETE FROM links WHERE alias = $1 RETURNING *", [alias]);
    return rows[0] || false;
}   

export const aumentarVisitas = async (alias) => {
    const { rows } = await query("UPDATE links SET visits = visits + 1 WHERE alias = $1 RETURNING *", [alias]);
    return rows[0] || false;
}
