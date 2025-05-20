
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Lightbulb, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

const quizData: QuizQuestion[] = [
  {
    id: "q1",
    questionText: "What does 'AI' stand for in the context of technology?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Interface"],
    correctAnswerIndex: 1,
    explanation: "AI stands for Artificial Intelligence, which is intelligence demonstrated by machines, as opposed to natural intelligence displayed by humans and animals.",
  },
  {
    id: "q2",
    questionText: "Which of these is a common programming language used for AI development?",
    options: ["HTML", "CSS", "Python", "Markdown"],
    correctAnswerIndex: 2,
    explanation: "Python is widely used in AI and machine learning due to its extensive libraries and frameworks like TensorFlow and PyTorch.",
  },
  {
    id: "q3",
    questionText: "What is a 'neural network' in AI?",
    options: ["A computer's motherboard", "A type of internet connection", "A system of interconnected nodes inspired by the human brain", "A security protocol"],
    correctAnswerIndex: 2,
    explanation: "A neural network is a computational model inspired by the way biological neural networks in the human brain process information.",
  },
   {
    id: "q4",
    questionText: "What is 'Machine Learning'?",
    options: ["Teaching machines to use tools", "A field of AI that enables systems to learn from data", "A type of computer hardware", "A new operating system"],
    correctAnswerIndex: 1,
    explanation: "Machine Learning is a subset of AI that focuses on building systems that can learn from and make decisions based on data.",
  },
];

interface QuizCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuizCard({ className, ...props }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | undefined>(undefined);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    if (!isAnswered) {
      setSelectedOption(value);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === undefined || !currentQuestion) return;

    const selectedIdx = currentQuestion.options.findIndex(opt => opt === selectedOption);
    const correct = selectedIdx === currentQuestion.correctAnswerIndex;
    
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setIsCorrect(null);
    setSelectedOption(undefined);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Optionally, loop back or show a "Quiz Completed" message
      setCurrentQuestionIndex(0); // Loop back for now
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(undefined);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  if (!currentQuestion) {
    return (
      <Card className={cn("bg-card", className)} {...props}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-accent" /> Tech Trivia Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quiz loading or completed!</p>
          <Button onClick={handleRestartQuiz} className="mt-4 w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-card flex flex-col h-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <Lightbulb className="h-7 w-7 mr-3 text-accent animate-pulse" /> Tech Trivia Challenge
        </CardTitle>
        <p className="text-xs text-muted-foreground">Question {currentQuestionIndex + 1} of {quizData.length}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base font-medium text-foreground mb-6">{currentQuestion.questionText}</p>
        <RadioGroup value={selectedOption} onValueChange={handleOptionChange} disabled={isAnswered}>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <RadioGroupItem 
                value={option} 
                id={`${currentQuestion.id}-option-${index}`} 
                className={cn(
                  "border-primary/50 text-primary focus:ring-primary/70",
                  isAnswered && currentQuestion.correctAnswerIndex === index && "bg-green-500/20 border-green-500 text-green-400",
                  isAnswered && selectedOption === option && currentQuestion.correctAnswerIndex !== index && "bg-red-500/20 border-red-500 text-red-400"
                )} 
              />
              <Label 
                htmlFor={`${currentQuestion.id}-option-${index}`}
                className={cn(
                  "text-sm font-normal text-foreground/90 cursor-pointer hover:text-primary",
                  isAnswered && currentQuestion.correctAnswerIndex === index && "text-green-400 font-semibold",
                  isAnswered && selectedOption === option && currentQuestion.correctAnswerIndex !== index && "text-red-400"
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {isAnswered && (
          <div className={cn(
            "mt-6 p-4 rounded-md text-sm",
            isCorrect ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-red-500/10 border border-red-500/30 text-red-300"
          )}>
            <div className="flex items-center mb-2">
              {isCorrect ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
              <span className="font-semibold">{isCorrect ? "Correct!" : "Incorrect!"}</span>
            </div>
            {currentQuestion.explanation && <p className="text-xs">{currentQuestion.explanation}</p>}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-border/30 pt-4 mt-auto">
        {isAnswered ? (
          <Button onClick={handleNextQuestion} className="w-full bg-accent hover:bg-accent/80">
            Next Question
          </Button>
        ) : (
          <Button onClick={handleSubmitAnswer} disabled={selectedOption === undefined} className="w-full">
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
