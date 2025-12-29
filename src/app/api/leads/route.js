import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { z } from "zod";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().min(1, "Sale name is required"),
  status: z.enum(["Open", "Lost", "Sold", "Stalled"]),
  amount: z.number().nonnegative(),
  stage: z.string().min(1),
  stagePercent: z.number().min(0).max(100).optional().default(0),
  nextActivityDate: z.string().datetime().optional().nullable(),
  saleDate: z.string().datetime(),
});

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);
    const skip = (page - 1) * pageSize;

    const collection = mongoose.connection.db.collection("leads");
    const [items, total] = await Promise.all([
      collection
        .find({})
        .sort({ saleDate: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json({
      data: items.map((i) => ({
        ...i,
        _id: i._id.toString(),
        saleDate: i.saleDate ? new Date(i.saleDate).toISOString() : null,
        nextActivityDate: i.nextActivityDate ? new Date(i.nextActivityDate).toISOString() : null,
      })),
      page,
      pageSize,
      total,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch leads", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = leadSchema.safeParse({
      ...body,
      amount: Number(body.amount),
      stagePercent: body.stagePercent !== undefined ? Number(body.stagePercent) : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = {
      ...parsed.data,
      saleDate: new Date(parsed.data.saleDate),
      nextActivityDate: parsed.data.nextActivityDate ? new Date(parsed.data.nextActivityDate) : undefined,
    };

    const collection = mongoose.connection.db.collection("leads");
    const result = await collection.insertOne(payload);
    const created = await collection.findOne({ _id: result.insertedId });
    return NextResponse.json(
      {
        data: {
          ...created,
          _id: created._id.toString(),
          saleDate: created.saleDate ? new Date(created.saleDate).toISOString() : null,
          nextActivityDate: created.nextActivityDate ? new Date(created.nextActivityDate).toISOString() : null,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create lead", details: err?.message },
      { status: 500 }
    );
  }
}
