"use client";

import { Question } from "@/lib/questions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerId: number) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Question {question.id}: {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={index.toString()} id={`q${question.id}-${index}`} />
              <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}