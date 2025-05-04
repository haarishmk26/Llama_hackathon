/**
 * Formats a prompt for the LLM to analyze UI changes and feedback
 * @param projectTitle The title of the project
 * @param beforeImages Array of before image descriptions or URLs
 * @param afterImages Array of after image descriptions or URLs
 * @param feedback Array of feedback items
 * @returns Formatted prompt string
 */
export function formatAnalysisPrompt(
  projectTitle: string,
  beforeImages: string[],
  afterImages: string[],
  feedback: any[],
) {
  return `
    Analyze the UI changes between the before and after versions of "${projectTitle}".
    
    Before UI Screenshots:
    ${beforeImages.map((img, i) => `- Image ${i + 1}: ${img}`).join("\n")}
    
    After UI Screenshots:
    ${afterImages.map((img, i) => `- Image ${i + 1}: ${img}`).join("\n")}
    
    User Feedback on Previous Version:
    ${feedback.map((item, i) => `- Feedback ${i + 1}: ${JSON.stringify(item)}`).join("\n")}
    
    Please provide:
    1. A summary of the key UI changes
    2. An analysis of how these changes address user feedback
    3. A list of specific UI elements that were modified
    4. Any outstanding issues that might still need to be addressed
  `
}
