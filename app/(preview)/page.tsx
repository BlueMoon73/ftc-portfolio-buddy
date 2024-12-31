"use client";
import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { feedbackArraySchema, Feedback } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import FeedbackDisplay from "@/components/feedback-display";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";

export default function ChatWithFiles() {
    const [files, setFiles] = useState<File[]>([]);
    const [feedback, setFeedback] = useState<any>(
        [],
    );
    const [isDragging, setIsDragging] = useState(false);


    const {
        submit,
        object: partialFeedback,
        isLoading,
    } = experimental_useObject({
        api: "/api/generate-quiz",
        schema: feedbackArraySchema,
        initialValue: undefined,
        onError: (error) => {
            console.error("Error from useObject:", error)
            toast.error("Failed to generate feedback. Please try again.");
            setFiles([]);
        },
        onFinish: ({ object }) => {
            console.log("onFinish object", object)
            try {
                setFeedback(object)

            } catch (e) {
                console.error("failed to parse object", e)
                setFeedback(object)
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari && isDragging) {
            toast.error(
                "Safari does not support drag & drop. Please use the file picker.",
            );
            return;
        }

        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter(
            (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
        );
        console.log(validFiles);

        if (validFiles.length !== selectedFiles.length) {
            toast.error("Only PDF files under 5MB are allowed.");
        }

        setFiles(validFiles);
    };

    const encodeFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const encodedFiles = await Promise.all(
            files.map(async (file) => ({
                name: file.name,
                type: file.type,
                data: await encodeFileAsBase64(file),
            })),
        );
        submit({ files: encodedFiles });
    };

    const clearPDF = () => {
        setFiles([]);
        setFeedback([]);
    };

    const progress = partialFeedback ? (partialFeedback.length / 9) * 100 : 0;


    if (feedback.length > 0) {
      return (
         <>
          <div className="min-h-screen bg-background text-foreground">
               <main className="container mx-auto px-4 py-12 max-w-4xl">
                  <CardHeader>
                  <CardTitle className="text-2xl font-bold">FTC Buddy❜s Feedback</CardTitle>
                  <CardDescription className="text-base">  

Unlock the awards you deserve, for the work you❜ve already done. {"\n"} Developed by {" "} 
<Link href="https://linktr.ee/ftc22012">
        FTC 22012
    </Link>
</CardDescription>
</CardHeader>
                   <CardContent className="space-y-4">
                        <FeedbackDisplay feedback={feedback} clearPDF={clearPDF} />
                   </CardContent>
                   <CardFooter>
                         <Button
                          onClick={clearPDF}
                          className="bg-primary hover:bg-primary/90 w-full"
                      >
                          Try Another Portfolio!
                      </Button>
                  </CardFooter>
               </main>
           </div>
               
         </>
      )
  }
    

    return (
        <div
            className="min-h-[100dvh] w-full flex justify-center"
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragExit={() => setIsDragging(false)}
            onDragEnd={() => setIsDragging(false)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                console.log(e.dataTransfer.files);
                handleFileChange({
                    target: { files: e.dataTransfer.files },
                } as React.ChangeEvent<HTMLInputElement>);
            }}
        >
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div>Drag and drop files here</div>
                        <div className="text-sm dark:text-zinc-400 text-zinc-500">
                            {"(PDFs only)"}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
                <CardHeader className="text-center space-y-6">
                    {/* Removed the icons */}
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">
                            FTC Portfolio Buddy
                        </CardTitle>
                        <CardDescription className="text-lg">
                        Unlock the awards you deserve, for the work you❜ve already done. {"\n"} Developed by {" "} 
                        <Link href="https://linktr.ee/ftc22012">
                        FTC 22012
                            </Link>
                        </CardDescription>

                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitWithFiles} className="space-y-4">
                        <div
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground text-center">
                                {files.length > 0 ? (
                                    <span className="font-medium text-foreground">
                                        {files[0].name}
                                    </span>
                                ) : (
                                    <span>Drop your Portfolio as PDF here or click to browse.</span>
                                )}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={files.length === 0}
                        >
                            {isLoading ? (
                                <span className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </span>
                            ) : (
                                "Generate Feedback"
                            )}
                        </Button>
                    </form>
                </CardContent>
                {isLoading && (
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="w-full space-y-1">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                                {partialFeedback
                                    ? `Generating feedback point ${partialFeedback.length + 1} of many,..`
                                    : "Analyzing Your Portfolio content"}
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>
              <motion.div
                    className="fixed bottom-6 text-xs text-center w-full"
                >
                    Developed by <Link href="https://linktr.ee/ftc22012">FTC 22012</Link>
                </motion.div>
        </div>
    );
}
