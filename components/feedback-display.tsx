// feedback-display.tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Feedback } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next"

interface FeedbackDisplayProps {
    feedback: Feedback[];
    clearPDF: () => void;
}

const FeedbackDisplay = ({ feedback, clearPDF }: FeedbackDisplayProps) => {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
                <CardContent className="space-y-4">
                    <ScrollArea className="h-[600px] w-full">
                        {feedback && feedback.length > 0 ? (
                            feedback.map((item, index) => (
                                <div key={index} className="mb-8 border rounded-md p-4">
                                    <h2 className="text-xl font-semibold mb-4">{item.award}</h2>
                                    <div className="space-y-2">
                                        {item.feedback.split("\n").map((line, lineIndex) => {
                                            const trimmedLine = line.trim();

                                            if (trimmedLine.startsWith("*Strengths:**")) {
                                                return (
                                                    <ul key={lineIndex} className="list-disc ml-4">
                                                        <li className="font-semibold">Strengths:</li>
                                                    </ul>
                                                );
                                            } else if (trimmedLine.startsWith("**Areas for Improvement:**")) {
                                                return (
                                                    <ul key={lineIndex} className="list-disc ml-4">
                                                        <li className="font-semibold">Areas for Improvement:</li>
                                                    </ul>
                                                );
                                            } else if (trimmedLine.startsWith("*")) {
                                                const content = trimmedLine.substring(1).trim();
                                                const priorityMatch = content.match(/\((High Priority|Medium Priority|Low Priority)\)/);
                                                let priority = null;
                                                let text = content;


                                                if(priorityMatch) {
                                                    priority = priorityMatch[1]
                                                    text = content.replace(priorityMatch[0], "").trim()

                                                }


                                                return (
                                                    <ul key={lineIndex} className="list-disc ml-8">
                                                        <li>{priority ? `(${priority}) ` : ''}{text}</li>
                                                    </ul>
                                                );
                                            }
                                            return <p key={lineIndex} className="ml-4">{line}</p>;
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No feedback to display</div>
                        )}
                    </ScrollArea>
                 </CardContent>
                 <SpeedInsights />
        </main>
    );
};

export default FeedbackDisplay;