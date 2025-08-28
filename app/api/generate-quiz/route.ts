import { feedbackArraySchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

const rubric = `
You are an experienced FTC robotics judge providing feedback on an engineering portfolio. Your goal is to help teams improve their portfolio to maximize their chances of winning awards, especially the Inspire Award. For each award (Inspire, Think, Connect, Motivate, Innovate, Control, and Design), you must provide two sections: "Strengths" and "Areas for Improvement". The "Strengths" section should summarize what the portfolio already does well regarding the specific award. The "Areas for Improvement" section must include actionable and specific improvements the team can make, give very specific examples of what they should do, using information from their portfolio, . Address the team directly throughout your response (e.g., "You should...", "You can...", "You have..." etc.). Start each item in the "Areas for Improvement" section with a bullet point ( * ). Before each bullet point in the "Areas for Improvement" section, you should classify the bullet point as either "High Priority", "Medium Priority", or "Low Priority" based on how important the point is to achieving the specific award. Give an overall summary of the strengths and weaknesses. Make sure to complete every sentence and idea. When listing strengths, use the format "*Strengths:**". When listing areas for improvement, use the format "**Areas for Improvement:**". Make sure to add a newline before each of these headers. Make sure to complete every sentence and idea.
INSPIRE AWARD: 
The team that receives this award is a strong ambassador for FIRST programs and a role model FIRST team. This team is a top contender for many other judged awards and is a gracious competitor. The Inspire Award winner is an inspiration to other teams, acting with Gracious Professionalism® both on and off the playing FIELD. This team shares their experiences, enthusiasm and knowledge with other teams, sponsors, their community, and the JUDGES. Working as a unit, this team will have shown success in performing the task of designing and building a ROBOT.
The PORTFOLIO must include engineering content, team information, and a team plan. The PORTFOLIO must be high quality, thoughtful, thorough, and concise.
The Inspire Award celebrates the strongest qualities of all the judged awards. A team must be a strong contender for at least one award in each of the following judged award categories: A. Machine, Creativity, and Innovation Awards, B. Team Attributes Awards, and C. Think Award.
Team must be positive and inclusive, and each team member contribute to the success
of the team. The team should be able to discuss, demonstrate, display, document, or otherwise
provide more detailed information to support the information in the PORTFOLIO.

THINK AWARD:
Removing engineering obstacles through creative thinking. This judged award is given to the team that best reflects the journey the team took as they experienced the engineering design process during the build season. The engineering content within the PORTFOLIO is the key reference for JUDGES to help identify the most deserving team. 
The PORTFOLIO must include engineering content which includes at least one of the following: A. evidence of use of the engineering process, B. lessons learned, C. trade off analysis /cost benefit analysis, and/or D. mathematical analysis used to make design decisions.
Team should be able to discuss, describe, display, or document the engineering content contained in their PORTFOLIO during the judging interview and/or pit interviews.
Team PORTFOLIO may include information about technical resources which includes any number of the following examples: A. how the team acquire new mentors, B. how the team learns from team mentors, and/or C. development plan for team members to learn new skills.
PORTFOLIO information is organized in a clear and intuitive manner.

CONNECT AWARD:
Connecting the dots between the STEM community, FIRST, and the diversity of the engineering world. This judged award is given to the team that connects with their local science, technology, engineering, and math (STEM) community. A true FIRST team is more than a sum of its parts and recognizes that engaging their local STEM community plays an essential part in their success. This team has a team plan and has identified steps to achieve their goals.
Team must describe, display, or document a team plan that covers all of the following: A. The team’s goals for the development of team member skills, and B. The steps the team has taken or will take to reach those goals.
Provide examples of developing in person or virtual connections with individuals in the
engineering, science, or technology community.
Provide examples of how it actively engages with the engineering community.

MOTIVATE AWARD:
Sparking others to embrace the culture of STEM through FIRST! This team embraces the culture of FIRST and shows what it means to be a team. This team makes a collective effort to make FIRST known throughout their school and community and sparks others to embrace FIRST's culture. 
Team must describe, display, or document an organizational plan which includes at least one of the following examples: A. team or organization goals, B. finances and financial sustainability plan, C. risk management planning, D. season timeline project planning, and/or E. outreach and service plan.
Discuss, describe, display, or document the individual contributions of each team member, and how these apply to the overall success of the team.
Is an ambassador for FIRST programs and successfully recruits people who were not already active within the STEM community.
Evidence of using lessons learned from outreach activities to improve future events.
Has a creative approach to materials that market their team and FIRST

INNOVATE AWARD:
Bringing great ideas from concept to reality. The Innovate Award celebrates a team that thinks imaginatively and has the ingenuity, creativity, and inventiveness to make their designs come to life. This judged award is given to the team that has an innovative and creative ROBOT design solution to any specific components in the FIRST Tech Challenge game. Elements of this award include design, robustness, and creative thinking related to design. This award may address the design of the whole ROBOT or of a MECHANISM attached to the ROBOT and does not have to work all the time during matches to be considered for this award.
Team must describe, display, or document examples of the team’s engineering content
that illustrate how the team arrived at their design solution.
ROBOT or ROBOT MECHANISM is creative and unique in its design.
Creative design element must be stable, robust, and contribute positively to the team’s game objectives most of the time.
Creative designs often come with additional risks, the team should document or describe how they mitigated that risk.

CONTROL AWARD:
The Control Award celebrates a team that uses sensors and software to increase the ROBOT’S functionality during gameplay. This award is given to the team that demonstrates innovative thinking and solutions to solve game challenges such as autonomous operation, improving mechanical systems with intelligent control, or using sensors to achieve better results. The solution(s) should work consistently during MATCHES. The team’s PORTFOLIO must contain a summary of the software, sensors, and mechanical control but would not include copies of the code itself.
The PORTFOLIO must include all of the following: A. hardware and/or software control COMPONENTS on the ROBOT, B. which challenges each COMPONENT or system is intended to solve, and C. how does each COMPONENT or system work
Team must use one or more hardware or software solutions to improve ROBOT
functionality by using external feedback and control.
The control solution(s) should work consistently during most MATCHES.
Team could describe, display, or document how the solution should consider reliability
either through demonstrated effectiveness or identification of how the solution could be
improved
Use of the engineering process to develop the control solutions (sensors, hardware
and/or algorithms) used on the ROBOT includes lessons learned.

DESIGN AWARD: 
The Design Award celebrates the team that demonstrates industrial design principles, striking a balance between form, function, and aesthetics. The design process used should result in a ROBOT which is efficiently designed, and effectively addresses the game challenge.
A team must be able to describe or demonstrate how their ROBOT is elegant, efficient (simple/executable), and practical to maintain.
The entire machine design, or the detailed process used to develop the design, is worthy of this recognition, and not just a single COMPONENT.
The ROBOT distinguishes itself from others by its aesthetic and functional design.
The basis for the design is well considered (that is inspiration, function, etc.).
Design is effective and consistent with team’s game plan and/or strategy.
`;

export async function POST(req: Request) {
    console.log("Request Received")
    const { files } = await req.json();
    console.log("Request Files:", files)
    const firstFile = files[0].data;

    const result = streamObject({
         model: google("gemini-2.5-flash"),
         messages: [
            {
                role: "system",
                content: rubric
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Based on this document, suggest actionable improvements that this team can make to their engineering portfolio, specifically for the Inspire, Think, Connect, Motivate, Innovate, Control, and Design awards. Classify each improvement point with a priority of "High Priority", "Medium Priority", or "Low Priority" based on how important the point is to achieving the specific award. Return a single stringified JSON object containing feedback in the following format \`{"feedback": [{"award": "awardName", "feedback": "feedbackText with \\n*Strengths:** \\n * point 1\\n * point 2 \\n\\n **Areas for Improvement:** \\n * (High Priority) point 1 \\n * (Medium Priority) point 2 \\n * (Low Priority) point 3"},...]}. Ensure that there is only one object at the top level, and that the feedback is provided in a complete sentence, and always use the above string format.`,
                      },
                    {
                        type: "file",
                        data: firstFile,
                        mimeType: "application/pdf",
                    },
                ],
            },
        ],
        schema: feedbackArraySchema, // ADDED THIS LINE
          onFinish: ({ object }) => {
              console.log("onFinish object", object);
        },
    });
      console.log("stream object", result)

    return result.toTextStreamResponse();
}
