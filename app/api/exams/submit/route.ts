import { NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_EXAMS } from "@/lib/mock-data";
import { getQuestionsForExam, gradeExam } from "@/lib/exam-grading";

const submitSchema = z.object({
  examId: z.string(),
  singleAnswers: z.record(z.string(), z.string()).default({}),
  tfAnswers: z.record(z.string(), z.record(z.string(), z.boolean())).default({}),
  shortAnswers: z.record(z.string(), z.string()).default({}),
  timeSpentSeconds: z.number().nonnegative().default(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submitSchema.parse(body);

    const exam = MOCK_EXAMS.find(
      (e) => e.id === validated.examId || e.slug === validated.examId
    );
    if (!exam) {
      return NextResponse.json(
        { error: "Không tìm thấy đề thi yêu cầu" },
        { status: 404 }
      );
    }

    const questions = getQuestionsForExam(exam);
    const result = gradeExam({
      exam,
      questions,
      singleAnswers: validated.singleAnswers,
      tfAnswers: validated.tfAnswers,
      shortAnswers: validated.shortAnswers,
      timeSpentSeconds: validated.timeSpentSeconds,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi xử lý nộp bài";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
