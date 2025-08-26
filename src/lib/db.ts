import mysql from "mysql2/promise";
import { dbConfig } from "@/config/database";

// Create connection pool
const pool = mysql.createPool(dbConfig);

export interface BirthdayPerson {
  cp_nome: string;
  cp_nasc_mes: number;
  cp_nasc_dia: number;
  cp_departamento: string;
}

export async function getBirthdaysByMonth(
  month: number
): Promise<BirthdayPerson[]> {
  try {
    console.log("Attempting to connect to database...");
    console.log("Database config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });

    const connection = await pool.getConnection();
    console.log("Database connection established successfully");

    const query = `
      SELECT cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento
      FROM tbl_telefones
      WHERE cp_nasc_mes = ?
      ORDER BY cp_nasc_dia, cp_nome
    `;

    console.log("Executing query for month:", month);
    const [rows] = await connection.execute(query, [month]);
    connection.release();

    console.log(
      "Query executed successfully, rows found:",
      Array.isArray(rows) ? rows.length : 0
    );
    return rows as BirthdayPerson[];
  } catch (error) {
    console.error("❌ Database connection error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw error; // Re-throw to be handled by the API route
  }
}

export async function getUpcomingBirthdays(): Promise<BirthdayPerson[]> {
  try {
    console.log("Attempting to connect to database...");
    console.log("Database config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });

    const connection = await pool.getConnection();
    console.log("Database connection established successfully");

    // Calculate date range: 3 days ago to 7 days from now
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Convert to month and day for comparison
    const startMonth = threeDaysAgo.getMonth() + 1;
    const startDay = threeDaysAgo.getDate();
    const endMonth = sevenDaysFromNow.getMonth() + 1;
    const endDay = sevenDaysFromNow.getDate();

    console.log("Date range:", { startMonth, startDay, endMonth, endDay });

    let query: string;
    let params: number[];

    if (startMonth === endMonth) {
      // Same month
      query = `
        SELECT cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento
        FROM tbl_telefones
        WHERE cp_nasc_mes = ? AND cp_nasc_dia BETWEEN ? AND ?
        ORDER BY cp_nasc_dia, cp_nome
      `;
      params = [startMonth, startDay, endDay];
    } else if (startMonth < endMonth) {
      // Different months (e.g., December to January)
      query = `
        SELECT cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento
        FROM tbl_telefones
        WHERE (cp_nasc_mes = ? AND cp_nasc_dia >= ?) 
           OR (cp_nasc_mes = ? AND cp_nasc_dia <= ?)
           OR (cp_nasc_mes > ? AND cp_nasc_mes < ?)
        ORDER BY cp_nasc_mes, cp_nasc_dia, cp_nome
      `;
      params = [startMonth, startDay, endMonth, endDay, startMonth, endMonth];
    } else {
      // Year boundary (e.g., December to January)
      query = `
        SELECT cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento
        FROM tbl_telefones
        WHERE (cp_nasc_mes = ? AND cp_nasc_dia >= ?) 
           OR (cp_nasc_mes = ? AND cp_nasc_dia <= ?)
           OR (cp_nasc_mes > ? OR cp_nasc_mes < ?)
        ORDER BY cp_nasc_mes, cp_nasc_dia, cp_nome
      `;
      params = [startMonth, startDay, endMonth, endDay, startMonth, endMonth];
    }

    console.log("Executing query:", query);
    console.log("Query params:", params);

    const [rows] = await connection.execute(query, params);
    connection.release();

    console.log(
      "Query executed successfully, rows found:",
      Array.isArray(rows) ? rows.length : 0
    );
    return rows as BirthdayPerson[];
  } catch (error) {
    console.error("❌ Database connection error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw error;
  }
}

export async function getCurrentMonthBirthdays(): Promise<BirthdayPerson[]> {
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
  return getBirthdaysByMonth(currentMonth);
}

export default pool;
