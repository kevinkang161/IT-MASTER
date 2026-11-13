import { NextResponse } from "next/server";
import { z } from "zod";
import { MOCK_QUESTIONS, MOCK_EXAMS } from "@/lib/mock-data";

const submitSchema = z.object({
  examId: z.string(),
  singleAnswers: z.record(z.string()).default({}),
  tfAnswers: z.record(z.record(z.boolean())).default({}),
  shortAnswers: z.record(z.string()).default({}),
  timeSpentSeconds: z.number().nonnegative().default(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submitSchema.parse(body);

    const exam = MOCK_EXAMS.find((e) => e.id === validated.examId || e.slug === validated.examId);
    if (!exam) {
      return NextResponse.json({ error: "Không tìm thấy đề thi yêu cầu" }, { status: 404 });
    }

    const questions = MOCK_QUESTIONS;
    let correctCount = 0;

    questions.forEach((q) => {
      if (q.question_type === "single_choice") {
        const selectedOptId = validated.singleAnswers[q.id];
        const opt = q.options?.find((o) => o.id === selectedOptId);
        if (opt?.is_correct) correctCount += 1;
      } else if (q.question_type === "short_answer") {
        const input = validated.shortAnswers[q.id]?.trim().toLowerCase();
        if (q.accepted_answers?.some((ans) => ans.trim().toLowerCase() === input)) {
          correctCount += 1;
        }
      } else if (q.question_type === "true_false") {
        const answers = validated.tfAnswers[q.id] || {};
        const isAllRight = q.options?.every((opt) => answers[opt.id] === opt.is_correct);
        if (isAllRight) correctCount += 1;
      }
    });

    const score = Number(((correctCount / questions.length) * exam.max_score).toFixed(2));
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const xpEarned = Math.round(exam.xp_reward * (score / exam.max_score));

    return NextResponse.json({
      success: true,
      score,
      maxScore: exam.max_score,
      passScore: exam.pass_score,
      isPassed: score >= exam.pass_score,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount: questions.length - correctCount,
      accuracy,
      timeSpentSeconds: validated.timeSpentSeconds,
      xpEarned,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Lỗi xử lý nộp bài" }, { status: 400 });
  }
}
